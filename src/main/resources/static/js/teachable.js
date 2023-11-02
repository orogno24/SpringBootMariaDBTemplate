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
                const { y, x } = keypoint.position;
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
