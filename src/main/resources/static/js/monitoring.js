const URL = "/assets/my_model/";
let model, webcam, ctx, maxPredictions;
let normalPostureCount = 0;
let abnormalPostureCount = 0;
let StartTime;
let startTime, endTime;
let minnormalPostureCount = 0;
let minabnormalPostureCount = 0;
let totalTime = 0;

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

    StartTime = Date.now();
    startTime = Date.now();

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
let lastUpdateTime = 0;
const updateInterval = 600; // 1분 간격
let time1 = 0;      // 구간 5등분
let time2 = 0;
let time3 = 0;
let time4 = 0;
let time5 = 0;

document.querySelectorAll('input[name="timeOption"]').forEach(function(radio) {
    radio.addEventListener('change', function(event) {
        // 선택된 라디오 버튼의 값을 읽어 selectedTime에 저장
        selectedTime = event.target.value;
    });
});


function updatePostureCounts() {
    document.getElementById('normalPostureCount').innerText = normalPostureCount;
    document.getElementById('abnormalPostureCount').innerText = abnormalPostureCount;
    document.getElementById('totalTime').innerText = totalTime;
    // document.getElementById('minnormalPostureCount').innerText = minnormalPostureCount;         // 분당 카운트
    // document.getElementById('minabnormalPostureCount').innerText = minabnormalPostureCount;
}

document.getElementById("stopButton").onclick = function () {

    endTime = Date.now();

    const totalTime = endTime - startTime;

    // 숨겨진 입력 필드에 카운트 값을 설정합니다.
    document.getElementById('hiddenNormalPostureCount').value = normalPostureCount;
    document.getElementById('hiddenAbnormalPostureCount').value = abnormalPostureCount;
    document.getElementById('hiddenTotalTime').value = totalTime / 1000;

    // AJAX 요청을 통해 서버로 데이터를 전송합니다.
    $.ajax({
        url: "/chart/insertChart",
        type: "post",
        dataType: "JSON",
        data: $("#postureDataForm").serialize(),
        success: function (json) {
            alert(json.msg);
            location.href = "/gazami10";
        },
        error: function (xhr, status, error) {
            // 에러 핸들링
            console.error("Error: " + error);
            alert("데이터 전송 중 오류가 발생했습니다.");
        }
    });
};

async function predict() {
    const currentTime = Date.now();

    totalTime = currentTime - StartTime;
    time1 = (totalTime / 5);
    time2 = (totalTime / 5)*2;
    time3 = (totalTime / 5)*3;
    time4 = (totalTime / 5)*4;
    time5 = totalTime;

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

        if (currentTime - lastUpdateTime >= updateInterval) {
            abnormalPostureCount++;
            lastUpdateTime = currentTime;
        }

        updatePostureCounts();
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
        if (currentTime - lastUpdateTime >= updateInterval) {
            normalPostureCount++;
            lastUpdateTime = currentTime;
        }
        updatePostureCounts();
        isClass2Active = false;
    }

    drawPose(pose);
}
