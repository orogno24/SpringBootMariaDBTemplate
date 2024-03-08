const video5 = document.getElementsByClassName('input_video5')[0];
const out5 = document.getElementsByClassName('output5')[0];
const controlsElement5 = document.getElementsByClassName('control5')[0];
const canvasCtx5 = out5.getContext('2d');

const fpsControl = new FPS();

const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};

const notificationSound = document.getElementById("notificationSound");
// const notificationSound2 = document.getElementById("notificationSound2");
const notificationSound4 = document.getElementById("notificationSound4");

function removeElements(landmarks, elements) {
    for (const element of elements) {
        delete landmarks[element];
    }
}

function removeLandmarks(results) {
    if (results.poseLandmarks) {
        removeElements(
            results.poseLandmarks,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]);
    }
}

function playNotificationSound() {
    notificationSound.play();
}

// function playNotificationSound2() {
//     notificationSound2.play();
// }

function playNotificationSound4() {
    notificationSound4.play();
}

function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1);
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
}

let poseTimer = null;
let conditionTimer = null; // 조건을 만족하는 시간을 계산하기 위한 타이머
let conditionMet = false; // 조건이 만족하는지 여부를 추적
let savedShoulderX = null;

function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

let regularWarningTimer = null;

// function startRegularWarning() {
//     regularWarningTimer = setInterval(playNotificationSound2, 200); // 1초마다 기존 경고음 재생
// }

function stopRegularWarning() {
    if (regularWarningTimer) {
        clearInterval(regularWarningTimer);
        regularWarningTimer = null;
    }
}

// 웹 페이지 로드 시 기존 경고음 재생 시작
// window.onload = startRegularWarning;


function onResultsPose(results) {
    const leftShoulderOutputElement = document.getElementById('leftShoulderCoordinates');
    const rightShoulderOutputElement = document.getElementById('rightShoulderCoordinates');

    if (!results.poseLandmarks) {
        leftShoulderOutputElement.innerText = ' 왼쪽 어깨 위치: 인식되지 않음';
        rightShoulderOutputElement.innerText = '오른쪽 어깨 위치: 인식되지 않음';
        return;
    }

    //  왼쪽 눈 랜드마크의 정보 출력
    const leftEyeLandmark = results.poseLandmarks[2];

    // 오른쪽 눈 랜드마크의 정보 출력
    const rightEyeLandmark = results.poseLandmarks[5];

    //  왼쪽 어깨 랜드마크의 정보 출력
    const leftShoulderLandmark = results.poseLandmarks[12];
    leftShoulderOutputElement.innerText = ` 왼쪽 어깨 위치: ${leftShoulderLandmark.x.toFixed(2)}`;

    // 오른쪽 어깨 랜드마크의 정보 출력
    const rightShoulderLandmark = results.poseLandmarks[11];
    rightShoulderOutputElement.innerText = `오른쪽 어깨 위치: ${rightShoulderLandmark.x.toFixed(2)}`;

    // 왼쪽 귀 랜드마크의 정보 출력
    const leftEarLandmark = results.poseLandmarks[8];

    // 오른쪽 귀 랜드마크의 정보 출력
    const rightEarLandmark = results.poseLandmarks[7];

    document.body.classList.add('loaded');
    removeLandmarks(results);
    fpsControl.tick();
    let grade = 0;
    const articleElement = document.getElementById('myArticle');
    const articleElement2 = document.getElementById('myArticle2');

    const shoulderCenter = (leftShoulderLandmark.x + rightShoulderLandmark.x) / 2;          // 양 어깨 중심점 x좌표
    const earCenter = (leftEarLandmark.x + rightEarLandmark.x) / 2;                         // 양 귀 중심점 x좌표
    const eyeCenter = (leftEyeLandmark.x + rightEyeLandmark.x) / 2;                         // 양 눈 중심점 x좌표
    const EyetoEarpx = Math.abs(earCenter - eyeCenter);                                  // 눈과 귀의 거리 x좌표 차이
    const ShouldertoEarpx = Math.abs(shoulderCenter - earCenter);                        // 어깨 중심점과 귀 중심점의 좌표차이
    const EyetoShoulderpx = Math.abs(shoulderCenter - eyeCenter);                        // 어깨 중심점과 눈 중심점의 좌표차이
    // 배포
    // const Distance = (EyetoShoulderpx * 10 / EyetoEarpx) - 10;                                   // 어깨 중심점과 귀 중심점의 좌표차이를 실제 거리로 나타냄.
    const Distance = (7.5 * ShouldertoEarpx) / EyetoEarpx;

    // 10 : (10 + distance) = EartoEyepx : ShouldertoEyepx                                  // 실제 거리 구하는 식
    //
    // distance = (ShouldertoEyepx * 10 / EartoEyepx) - 10


    if (Math.abs(leftShoulderLandmark.x - rightShoulderLandmark.x) < 0.2 && leftShoulderLandmark.x > 0 && leftShoulderLandmark.y > 0) {
        // 조건이 만족하는 경우
        articleElement.style.backgroundColor = '#9ef5f5';
        articleElement2.style.backgroundColor = '#9ef5f5';
        stopRegularWarning(); // 기존 경고음 정지
        playNotificationSound();

        if (!conditionMet) {
            conditionMet = true;
            conditionTimer = setTimeout(() => {


                // 배포
                // if (Distance < 2.5) {
                //     grade = 1;
                // } else if (Distance >= 2.5 && Distance < 5.0) {
                //     grade = 2;
                // } else if (Distance >= 5.0 && Distance < 6.5) {
                //     grade = 3;
                // } else if (Distance >= 6.5 && Distance < 8.0) {
                //     grade = 4;
                // } else if (Distance >= 8.0) {
                //     grade = 5;
                // }

                if (Distance < 5.5) {
                    grade = 1;
                } else if (Distance >= 5.5 && Distance < 8.0) {
                    grade = 2;
                } else if (Distance >= 8.0 && Distance < 12) {
                    grade = 3;
                } else if (Distance >= 12 && Distance < 14) {
                    grade = 4;
                } else if (Distance >= 14) {
                    grade = 5;
                }

                sendGrade(grade);
                playNotificationSound4();
                alert("거북목 측정이 완료되었습니다!");
                window.location.href = "/redirect4";
            }, 5000);
        }
    } else {
        // 조건이 더 이상 만족하지 않는 경우
        articleElement.style.backgroundColor = '#f8f8f8';
        articleElement2.style.backgroundColor = '#f8f8f8';
        if (conditionMet) {
            // startRegularWarning();
            clearTimeout(conditionTimer); // 타이머 초기화
            conditionMet = false;
        }
    }

    canvasCtx5.save();
    canvasCtx5.clearRect(0, 0, out5.width, out5.height);
    canvasCtx5.drawImage(
        results.image, 0, 0, out5.width, out5.height);
    drawConnectors(
        canvasCtx5, results.poseLandmarks, POSE_CONNECTIONS, {
            color: (data) => {
                const x0 = out5.width * data.from.x;
                const y0 = out5.height * data.from.y;
                const x1 = out5.width * data.to.x;
                const y1 = out5.height * data.to.y;

                const z0 = clamp(data.from.z + 0.5, 0, 1);
                const z1 = clamp(data.to.z + 0.5, 0, 1);

                const gradient = canvasCtx5.createLinearGradient(x0, y0, x1, y1);
                gradient.addColorStop(
                    0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
                gradient.addColorStop(
                    1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
                return gradient;
            }
        });
    drawLandmarks(
        canvasCtx5,
        Object.values(POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]),
        {color: zColor, fillColor: '#57c4ff'});
    drawLandmarks(
        canvasCtx5,
        Object.values(POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]),
        {color: zColor, fillColor: '#57c4ff'});
    drawLandmarks(
        canvasCtx5,
        Object.values(POSE_LANDMARKS_NEUTRAL)
            .map(index => results.poseLandmarks[index]),
        {color: zColor, fillColor: '#AAAAAA'});
    canvasCtx5.restore();
}

function sendGrade(grade) {
    // fetch API를 사용하여 grade 값을 서버에 전송
    fetch('/user/gradeProc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({grade: grade}),
    })
        .then(response => response.json())
        .then(data => console.log('Grade successfully sent:', data))
        .catch((error) => console.error('Error:', error));
}

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
    }
});
pose.onResults(onResultsPose);

const camera = new Camera(video5, {
    onFrame: async () => {
        await pose.send({image: video5});
    },
    width: 480,
    height: 480
});
camera.start();

new ControlPanel(controlsElement5, {
    selfieMode: true,
    upperBodyOnly: true,
    smoothLandmarks: true,
    minDetectionConfidence: 0.3,
    minTrackingConfidence: 0.3
})
    .add([
        new StaticText({title: 'MediaPipe Pose'}),
        fpsControl,
        new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
        new Toggle({title: 'Upper-body Only', field: 'upperBodyOnly'}),
        new Toggle({title: 'Smooth Landmarks', field: 'smoothLandmarks'}),
        new Slider({
            title: 'Min Detection Confidence',
            field: 'minDetectionConfidence',
            range: [0, 1],
            step: 0.01
        }),
        new Slider({
            title: 'Min Tracking Confidence',
            field: 'minTrackingConfidence',
            range: [0, 1],
            step: 0.01
        }),
    ])
    .on(options => {
        video5.classList.toggle('selfie', options.selfieMode);
        pose.setOptions(options);
    });