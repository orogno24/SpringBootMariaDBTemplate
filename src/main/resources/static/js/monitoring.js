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
                ctx.fillStyle = 'gray';
                ctx.fill();
            });

            // 어깨 선 그리기
            ctx.beginPath();
            ctx.moveTo(leftShoulder.position.x, leftShoulder.position.y);
            ctx.lineTo(rightShoulder.position.x, rightShoulder.position.y);
            ctx.strokeStyle = 'gray';
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
        window.location.href = '/main';  // 이곳에 원하는 페이지의 URL을 설정하세요
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
let class3StartTime = 0;
let isClass3Active = false;

async function predict() {
    const {pose, posenetOutput} = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    }

    const class2 = prediction.find(p => p.className === "Class 2");
    if (class2 && class2.probability.toFixed(2) === "1.00") {
        if (!isClass2Active) {
            isClass2Active = true;
            class2StartTime = Date.now();
        } else if (Date.now() - class2StartTime > 2000) {
            updateTimeline();
            count++;
            if (count < 2) {
                showStretchingTips();
            }
            isClass2Active = false;
        }
    } else {
        isClass2Active = false;
    }

    const class3 = prediction.find(p => p.className === "Class 3");
    if (class3 && class3.probability.toFixed(2) === "1.00") {
        if (!isClass3Active) {
            isClass3Active = true;
            class3StartTime = Date.now();
        } else if (Date.now() - class3StartTime > 3000) { // 3초 체크
            updateTimelineForClass3();
            count++;
            isClass3Active = false;
        }
    } else {
        isClass3Active = false;
    }

    drawPose(pose);
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
    newRow.innerHTML = `<td>${formattedTime} - <span><strong>거북목 자세 경고</strong></span></td>`;

    sound();

    alert("거북목 자세 경고! 자세를 바로잡아주세요.");

    // 행 수가 5개를 초과하면 맨 아래 행을 제거
    if (tbody.rows.length > 5 && count < 5) {
        tbody.deleteRow(-1);
    }
}

function updateTimelineForClass3() {
    const currentTime = new Date();
    const formattedTime = format12HourTime(currentTime); // 12시간 형식으로 포맷
    const tbody = document.querySelector("#table-container table tbody");
    const newRow = tbody.insertRow(0); // 맨 위에 새로운 행 추가
    newRow.innerHTML = `<td>${formattedTime} - <span style="color: #c20000">자리 비움</span></td>`;

    // 필요한 경우 추가적인 행동 (예: 소리 재생)
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

