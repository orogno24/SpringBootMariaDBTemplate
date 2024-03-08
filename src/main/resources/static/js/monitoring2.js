function drawShoulders(pose, minPartConfidence, ctx) {
    if (pose) {
        // 어깨 키포인트: 왼쪽 어깨 (5), 오른쪽 어깨 (6)
        const leftShoulder = pose.keypoints[5];
        const rightShoulder = pose.keypoints[6];

        // 두 어깨 모두 신뢰도가 충분히 높은 경우에만 선을 그립니다.
        if (leftShoulder.score > minPartConfidence && rightShoulder.score > minPartConfidence) {
            // 어깨 점 그리기
            [leftShoulder, rightShoulder].forEach(keypoint => {
                const {y, x} = keypoint.position;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = '#b5ff34';
                ctx.fill();
            });

            // 어깨 선 그리기
            ctx.beginPath();
            ctx.moveTo(leftShoulder.position.x, leftShoulder.position.y);
            ctx.lineTo(rightShoulder.position.x, rightShoulder.position.y);
            ctx.strokeStyle = '#b5ff34';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}

function drawPose(pose) {
    if (webcam.canvas) {
        // 웹캠 피드를 그립니다
        ctx.drawImage(webcam.canvas, 0, 0);

        // 웹캠 이미지 위에 실루엣을 그립니다
        const silhouette = document.getElementById('silhouetteImage');
        if (silhouette && silhouette.complete) {
            // 이미지가 로드되었는지 확인합니다
            const scaleX = webcam.canvas.width / silhouette.naturalWidth;
            const scaleY = webcam.canvas.height / silhouette.naturalHeight;
            const scale = Math.min(scaleX, scaleY);

            // 이미지를 중앙에 위치시키기 위한 계산
            const x = (webcam.canvas.width / 2) - (silhouette.naturalWidth / 2) * scale;
            const y = (webcam.canvas.height / 2) - (silhouette.naturalHeight / 2) * scale;

            // 캔버스에 실루엣 이미지를 그립니다
            ctx.drawImage(silhouette, x, y, silhouette.naturalWidth * scale, silhouette.naturalHeight * scale);
        }

        // 포즈가 있으면 해당하는 키포인트(여기서는 어깨)를 그립니다
        if (pose) {
            const minPartConfidence = 0.5;
            drawShoulders(pose, minPartConfidence, ctx);
        }
    }
}

function updateUserAbsentTimeline() {
    // 타임라인에 메시지 추가
    const currentTime = new Date();
    const formattedTime = format12HourTime(currentTime); // 12시간 형식으로 포맷
    const tbody = document.querySelector("#table-container table tbody");
    const newRow = tbody.insertRow(0); // 맨 위에 새로운 행 추가
    newRow.innerHTML = `<td>${formattedTime} - <span style="color: #d76100"><strong>사용자 자리 비움</strong></span></td>`;

    alert("사용자가 자리를 비웠습니다. 잠시 후 다시 시작하세요.");

    if (tbody.rows.length > 5 && count < 5) {
        tbody.deleteRow(-1);
    }
}

function updateTimeline() {
    const currentTime = new Date();
    const formattedTime = format12HourTime(currentTime); // 12시간 형식으로 포맷
    const tbody = document.querySelector("#table-container table tbody");
    const newRow = tbody.insertRow(0); // 맨 위에 새로운 행 추가
    newRow.innerHTML = `<td>${formattedTime} - <span><strong>거북목 자세 경고 </strong></span></td>`;

    if (document.querySelector('input[name="alertOption"]:checked').value === "alertA") {
        sound();
    } else {
        sound2();
    }

    alert("거북목 자세 경고! 자세를 바로잡아주세요.");

    // 행 수가 5개를 초과하면 맨 아래 행을 제거
    if (tbody.rows.length > 5 && count < 5) {
        tbody.deleteRow(-1);
    }
}

function showStretchingTips() {
    // 거북목 운동 div를 가져옵니다.
    var neckExerciseDiv = document.getElementById("neckExercise");

    neckExerciseDiv.style.display = "block";

    neckExerciseDiv.scrollIntoView({behavior: 'smooth'});
}

const playSound = document.getElementById("playSound");
const playSound2 = document.getElementById("playSound2");

function sound() {
    playSound.play();
}

function sound2() {
    playSound2.play();
}

window.onload = function () {
    cycleDots();
}

function cycleDots() {
    var textElement = document.querySelector('h1'); // "자세 분석 중..." 텍스트를 포함하는 h1 태그 선택
    var dotCount = 0;

    setInterval(function () {
        var dots = ".".repeat(dotCount);
        textElement.textContent = "자세 분석 중" + dots; // 텍스트 업데이트
        dotCount = (dotCount + 1) % 5; // 마침표 개수를 0에서 4까지 순환
    }, 500); // 매 0.5초마다 실행
}

function format12HourTime(time) {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 시간이 0이면 12로 변경
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${ampm} ${hours}:${minutes}:${seconds}`;
}

function toggleWebcam() {
    const canvasElement = document.getElementById("canvas");
    const imageElement = document.getElementById("placeholderImage");
    const hideCameraButton = document.getElementById("hideCameraButton");

    if (canvasElement.style.display !== "none") {
        canvasElement.style.display = "none";
        imageElement.style.display = "block";
        hideCameraButton.textContent = "카메라 표시하기";
    } else {
        canvasElement.style.display = "block";
        imageElement.style.display = "none";
        hideCameraButton.textContent = "카메라 숨기기";
    }
}

// // alertOption 라디오 버튼의 값을 확인하고, 해당하는 효과음을 재생하는 함수
// function changeAlertSound() {
//     // 오디오 요소를 가져옵니다.
//     var audioElement = document.getElementById('playSound');
//
//     // 선택된 라디오 버튼의 값을 찾습니다.
//     var alertOptions = document.getElementsByName('alertOption');
//     for (var i = 0; i < alertOptions.length; i++) {
//         if (alertOptions[i].checked) {
//             // 선택된 alertOption에 따라 오디오 파일을 변경합니다.
//             switch (alertOptions[i].value) {
//                 case 'alertA':
//                     audioElement.src = '/assets/img/alarm3.mp3'; // 실제 오디오 파일 경로로 변경하세요.
//                     break;
//                 case 'alertB':
//                     audioElement.src = '/assets/img/tts1.mp3'; // 실제 오디오 파일 경로로 변경하세요.
//                     break;
//             }
//             break;
//         }
//     }
// }

// 모든 라디오 버튼에 이벤트 리스너를 추가하여, 값이 변경될 때마다 changeAlertSound 함수가 호출되도록 합니다.
var alertOptions = document.getElementsByName('alertOption');
for (var i = 0; i < alertOptions.length; i++) {
    alertOptions[i].addEventListener('change', changeAlertSound);
}

// 페이지 로드 시 기본 효과음을 설정합니다.
document.addEventListener('DOMContentLoaded', changeAlertSound);
