
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
// const URL = 'https://teachablemachine.withgoogle.com/models/5Y0TYTFwq/'; // V1
// const URL = "https://teachablemachine.withgoogle.com/models/A68cV-fBS/"; // V2
const URL = "https://teachablemachine.withgoogle.com/models/4qimYVUfh/"
// const URL = "./turtle-model/turtle-model-v3/"
//V3
let model, webcam, ctx, labelContainer, maxPredictions;

async function init(callback) {

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = document.getElementById('canvas').width;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById('canvas');
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext('2d');
    labelContainer = document.getElementById('label-container');

    // 거묵복 모델 구동
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }

    callback()
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

var status = 'straight';
var count = 0;

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    prediction[0].className = '바른 자세';
    prediction[1].className = '거북목';


    var progressBarElement = document.getElementsByClassName("progress-bar-main")[0];
    var progressBarCode = '<div class=\"progress\" style=\"height: 3rem\">'

    progressBarCode += '<div class=\"progress-bar progress-bar-striped bg-success\" role=\"progressbar\" style=\"width:'
    progressBarCode += prediction[0].probability.toFixed(1) * 100
    progressBarCode += '%\">'
    progressBarCode += prediction[0].probability.toFixed(1) * 100
    progressBarCode += '%</div>'

    progressBarCode += '<div class=\"progress-bar progress-bar-striped bg-danger\" role=\"progressbar\" style=\"width:'
    progressBarCode += prediction[1].probability.toFixed(1) * 100
    progressBarCode += '%\">'
    progressBarCode += prediction[1].probability.toFixed(1) * 100
    progressBarCode += '%</div>'

    progressBarCode += '</div>'

    progressBarElement.innerHTML = progressBarCode;


    // document.getElementsByClassName("progress-bar.progress-bar-success").style.width = "30%";


    // console.log(prediction[0].probability);

    if (prediction[0].probability.toFixed(2) >= 0.95) {
        status = 'straight';
    } else if (prediction[1].probability.toFixed(2) == 1) {
        if (status == 'straight') {
            // 횟수 카운트
            if (document.getElementById("count-toggle").checked) {
                count++;
                $('.counter').html(count);
            }

            // 꼬부기 소리 재생
            // var audio = new Audio('kkobu.mp3');
            // audio.play();

            // $('#sound_toggle').click(function() {
            // 	if ($(this).val() == "on") {
            // 		console.log("sound_on")
            // 	}
            // 	else {
            // 		console.log("sound_off")
            //    }
            // });

            if (document.getElementById("sound-toggle").checked) {
                var audio = new Audio('kkobu.mp3');
                audio.play();
            }


            // 진동
            if (document.getElementById("vibrate-toggle").checked) {
                vibrate();
            }


            // 거북목 자세 캡처
            fromDataURL();

        }

        status = 'turtle';
    }

    // 클래스별 확률값 숫자로 나오는 부분
    // for (let i = 0; i < maxPredictions; i++) {
    // 	const classPrediction =
    // 		prediction[i].className + ': ' + prediction[i].probability.toFixed(2);

    // 	labelContainer.childNodes[i].innerHTML = classPrediction;
    // }

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(
            webcam.canvas,
            0,
            0,
            webcam.canvas.width,
            webcam.canvas.height
        );

        // 가이드라인 그리기
        var line_img = document.getElementById("head_shoulder_line_img")
        ctx.drawImage(
            line_img,
            0,
            0,
            webcam.canvas.width,
            webcam.canvas.height
        );
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

// // Take action when the image has loaded
// function save() {
// 	var canvasURL = webcam.canvas.toDataURL('turtle_image/png');
// }

