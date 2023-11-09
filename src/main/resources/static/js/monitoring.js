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


const URL = "/assets/my_model/";
let model, webcam, ctx, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 500;
    const flip = true;
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    const canvas = document.getElementById("canvas");
    canvas.classList.add("active-border");
    document.getElementById("table-container").style.display = "block";
    document.getElementById("pbox").style.display = "block";
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    document.getElementById("startButton").style.display = "none";
    document.getElementById("hideCameraButton").style.display = "block";
    document.getElementById("stopButton").style.display = "block";
    document.getElementById("editButton").style.display = "block";
    document.getElementById("statusText").style.display = "block";
    document.getElementById("analysisText").style.display = "block";

    document.getElementById("stopButton").onclick = function () {
        window.location.href = '/gazami10';  // 이곳에 원하는 페이지의 URL을 설정하세요
    };

    document.getElementById("editButton").onclick = function () {
        var timeSettingBox = document.getElementById("timeSettingBox");
        timeSettingBox.style.display = timeSettingBox.style.display === "none" ? "block" : "none";
    };

    var close = document.getElementsByClassName("close-time-setting")[0];
    close.onclick = function () {
        var timeSettingBox = document.getElementById("timeSettingBox");
        timeSettingBox.style.display = "none";
    }

    // 바깥 영역을 클릭하면 설정 창 닫기
    window.onclick = function (event) {
        var timeSettingBox = document.getElementById("timeSettingBox");
        if (event.target == timeSettingBox) {
            timeSettingBox.style.display = "none";
        }
    }

    var close2 = document.getElementsByClassName("neckExercise-setting")[0];
    close2.onclick = function () {
        var neckExercise = document.getElementById("neckExercise");
        neckExercise.style.display = "none";
    }

    // 바깥 영역을 클릭하면 설정 창 닫기
    window.onclick = function (event) {
        var neckExercise = document.getElementById("neckExercise");
        if (event.target == neckExercise) {
            neckExercise.style.display = "none";
        }
    }


    // 라디오 버튼의 변화를 감지하여 timeSettingForUpdate 값을 업데이트
    document.querySelectorAll('input[name="timeOption"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            timeSettingForUpdate = this.value;
        });
    });
}

function showStretchingTips() {
    // 거북목 운동 div를 가져옵니다.
    var neckExerciseDiv = document.getElementById("neckExercise");

    neckExerciseDiv.style.display = "block";

    neckExerciseDiv.scrollIntoView({behavior: 'smooth'});
}

async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

let count = 0;
let class2StartTime = 0;
let isClass2Active = false;
let selectedTime = 2000; // 기본값
const USER_NOT_PRESENT_THRESHOLD = 0.1; // 실험을 통해 적절한 값을 찾아야함
let userNotPresentTimer = null; // 사용자가 보이지 않는 시간을 추적하는 타이머
const USER_NOT_PRESENT_DELAY = 5000; // 5초 지연
let showinfo = 0; // 알림창 변수

document.querySelectorAll('input[name="timeOption"]').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
        // 선택된 라디오 버튼의 값을 읽어 selectedTime에 저장
        selectedTime = event.target.value;
    });
});

async function predict() {
    const {pose, posenetOutput} = await model.estimatePose(webcam.canvas);

    // 사용자 감지 여부를 체크합니다.
    if (!pose || pose.score < USER_NOT_PRESENT_THRESHOLD) {
        // 사용자가 보이지 않으면 타이머를 설정합니다.
        if (userNotPresentTimer === null) {
            userNotPresentTimer = setTimeout(() => {
                updateUserAbsentTimeline();
                count++;
            }, USER_NOT_PRESENT_DELAY);
        }
        return; // 이벤트 루프의 다음 사이클로 이동합니다.
    } else {
        // 사용자가 감지되면 타이머를 초기화합니다.
        if (userNotPresentTimer !== null) {
            clearTimeout(userNotPresentTimer);
            userNotPresentTimer = null;
        }
    }

    const prediction = await model.predict(posenetOutput);

    var progressBarElement = document.getElementsByClassName("progress-bar-main")[0];
    var progressBarCode = '<div class=\"progress\" style=\"height: 2rem\">'

    progressBarCode += '<div class=\"progress-bar progress-bar-striped bg-success\" role=\"progressbar\" style=\"font-size:15px;width:'
    progressBarCode += prediction[0].probability.toFixed(1) * 100
    progressBarCode += '%\">'
    progressBarCode += prediction[0].probability.toFixed(1) * 100
    progressBarCode += '%</div>'

    progressBarCode += '<div class=\"progress-bar progress-bar-striped bg-danger\" role=\"progressbar\" style=\"font-size:15px;width:'
    progressBarCode += prediction[1].probability.toFixed(1) * 100
    progressBarCode += '%\">'
    progressBarCode += prediction[1].probability.toFixed(1) * 100
    progressBarCode += '%</div>'

    progressBarCode += '</div>'

    progressBarElement.innerHTML = progressBarCode;

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    }

    const class2 = prediction.find(p => p.className === "Class 2");
    if (class2 && class2.probability.toFixed(2) === "1.00") {
        if (!isClass2Active) {
            isClass2Active = true;
            class2StartTime = Date.now();
        } else if (Date.now() - class2StartTime > selectedTime) {
            updateTimeline();
            count++;
            if (showinfo === 0) {
                showStretchingTips();
                showinfo = 1;
            }
            isClass2Active = false;
        }
    } else {
        isClass2Active = false;
    }

    drawPose(pose);
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

const playSound = document.getElementById("playSound");

function sound() {
    playSound.play();
}

function updateTimeline() {
    const currentTime = new Date();
    const formattedTime = format12HourTime(currentTime); // 12시간 형식으로 포맷
    const tbody = document.querySelector("#table-container table tbody");
    const newRow = tbody.insertRow(0); // 맨 위에 새로운 행 추가
    newRow.innerHTML = `<td>${formattedTime} - <span><strong>거북목 자세 경고 </strong></span></td>`;

    sound();

    alert("거북목 자세 경고! 자세를 바로잡아주세요.");

    // 행 수가 5개를 초과하면 맨 아래 행을 제거
    if (tbody.rows.length > 5 && count < 5) {
        tbody.deleteRow(-1);
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
