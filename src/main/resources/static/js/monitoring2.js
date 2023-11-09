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

// alertOption 라디오 버튼의 값을 확인하고, 해당하는 효과음을 재생하는 함수
function changeAlertSound() {
    // 오디오 요소를 가져옵니다.
    var audioElement = document.getElementById('playSound');

    // 선택된 라디오 버튼의 값을 찾습니다.
    var alertOptions = document.getElementsByName('alertOption');
    for (var i = 0; i < alertOptions.length; i++) {
        if (alertOptions[i].checked) {
            // 선택된 alertOption에 따라 오디오 파일을 변경합니다.
            switch (alertOptions[i].value) {
                case 'alertA':
                    audioElement.src = '/assets/img/alarm.mp3'; // 실제 오디오 파일 경로로 변경하세요.
                    break;
                case 'alertB':
                    audioElement.src = '/assets/img/guide2.mp3'; // 실제 오디오 파일 경로로 변경하세요.
                    break;
                // 추가적인 alertOption에 대한 case를 여기에 추가할 수 있습니다.
            }
            break;
        }
    }
}

// 모든 라디오 버튼에 이벤트 리스너를 추가하여, 값이 변경될 때마다 changeAlertSound 함수가 호출되도록 합니다.
var alertOptions = document.getElementsByName('alertOption');
for (var i = 0; i < alertOptions.length; i++) {
    alertOptions[i].addEventListener('change', changeAlertSound);
}

// 페이지 로드 시 기본 효과음을 설정합니다.
document.addEventListener('DOMContentLoaded', changeAlertSound);
