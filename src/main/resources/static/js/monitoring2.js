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
