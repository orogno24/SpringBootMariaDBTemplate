const video5 = document.getElementsByClassName('input_video5')[0];
const out5 = document.getElementsByClassName('output5')[0];
const controlsElement5 = document.getElementsByClassName('control5')[0];
const canvasCtx5 = out5.getContext('2d');

const fpsControl = new FPS();

const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};

function zColor(data) {
    const z = clamp(data.from.z + 0.5, 0, 1);
    return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
}

let poseTimer = null;

function onResultsPose(results) {
    const leftShoulderOutputElement = document.getElementById('leftShoulderCoordinates');
    const rightShoulderOutputElement = document.getElementById('rightShoulderCoordinates');
    const leftHandOutputElement = document.getElementById('leftHandCoordinates');
    const rightHandOutputElement = document.getElementById('rightHandCoordinates');

    if (!results.poseLandmarks) {
        leftShoulderOutputElement.innerText = ' 왼쪽 어깨 좌표: 인식되지 않음';
        rightShoulderOutputElement.innerText = '오른쪽 어깨 좌표: 인식되지 않음';
        leftHandOutputElement.innerText = '왼쪽 손 좌표: 인식되지 않음';
        rightHandOutputElement.innerText = '오른쪽 손 좌표: 인식되지 않음';
        return;
    }

    //  왼쪽 어깨 랜드마크의 정보 출력
    const leftShoulderLandmark = results.poseLandmarks[12];
    leftShoulderOutputElement.innerText = ` 왼쪽 어깨 좌표: x=${leftShoulderLandmark.x.toFixed(2)}, y=${leftShoulderLandmark.y.toFixed(2)}, z=${leftShoulderLandmark.z.toFixed(2)}`;

    // 오른쪽 어깨 랜드마크의 정보 출력
    const rightShoulderLandmark = results.poseLandmarks[11];
    rightShoulderOutputElement.innerText = `오른쪽 어깨 좌표: x=${rightShoulderLandmark.x.toFixed(2)}, y=${rightShoulderLandmark.y.toFixed(2)}, z=${rightShoulderLandmark.z.toFixed(2)}`;

    // 왼쪽 손 랜드마크의 정보 출력
    const leftHandLandmark = results.poseLandmarks[20];
    leftHandOutputElement.innerText = `왼쪽 손 좌표: x=${leftHandLandmark.x.toFixed(2)}, y=${leftHandLandmark.y.toFixed(2)}, z=${leftHandLandmark.z.toFixed(2)}`;

    // 오른쪽 손 랜드마크의 정보 출력
    const rightHandLandmark = results.poseLandmarks[19];
    rightHandOutputElement.innerText = `오른쪽 손 좌표: x=${rightHandLandmark.x.toFixed(2)}, y=${rightHandLandmark.y.toFixed(2)}, z=${rightHandLandmark.z.toFixed(2)}`;

    if (leftHandLandmark.y < 0.5) {
        if (!poseTimer) {
            poseTimer = setTimeout(() => {
                // 애니메이션 효과 적용
                document.body.classList.add('flash-effect');
                setTimeout(() => document.body.classList.remove('flash-effect'), 3000);
                alert("왼쪽 팔을 3초동안 올린 상태입니다!");
                poseTimer = null;
            }, 3000);
        }
    } else {
        if (poseTimer) {
            clearTimeout(poseTimer);
            poseTimer = null;
        }
    }

    document.body.classList.add('loaded');
    fpsControl.tick();

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
        {color: zColor, fillColor: '#FF0000'});
    drawLandmarks(
        canvasCtx5,
        Object.values(POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]),
        {color: zColor, fillColor: '#00FF00'});
    drawLandmarks(
        canvasCtx5,
        Object.values(POSE_LANDMARKS_NEUTRAL)
            .map(index => results.poseLandmarks[index]),
        {color: zColor, fillColor: '#AAAAAA'});
    canvasCtx5.restore();
}

const pose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
    }});
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
    upperBodyOnly: false,
    smoothLandmarks: true,
    minDetectionConfidence: 0.3,
    minTrackingConfidence: 0.6
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