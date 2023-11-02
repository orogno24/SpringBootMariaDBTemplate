window.onload = function () {
    cycleDots();
}

function cycleDots() {
    var textElement = document.querySelector('h1'); // "자세 체크 중..." 텍스트를 포함하는 h1 태그 선택
    var dotCount = 0;

    setInterval(function () {
        var dots = ".".repeat(dotCount);
        textElement.textContent = "자세 체크 중" + dots; // 텍스트 업데이트
        dotCount = (dotCount + 1) % 5; // 마침표 개수를 0에서 4까지 순환
    }, 500); // 매 0.5초마다 실행
}
