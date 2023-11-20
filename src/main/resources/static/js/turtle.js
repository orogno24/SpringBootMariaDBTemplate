
function addFeedEffect() {
    var foodImage = $(".item-img"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    var screenEffect = $("#screenEffect"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    foodImage.addClass("animate-towards-turtle");
    screenEffect.addClass("effect-active");

    // 효과음 재생
    var feedSound = document.getElementById("feedSound");
    feedSound.play();

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(function() {
        foodImage.removeClass("animate-towards-turtle");
        location.href = "/user/turtle"; // 애니메이션이 끝난 후 페이지 리디렉션
    }, 1000); // 애니메이션 시간에 맞게 조절 필요
}

function addFeedEffect2() {
    var foodImage = $(".item-img2"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    foodImage.addClass("animate-towards-turtle2");

    // 효과음 재생
    var feedSound = document.getElementById("feedSound");
    feedSound.play();

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(function() {
        foodImage.removeClass("animate-towards-turtle2");
        location.href = "/user/turtle"; // 애니메이션이 끝난 후 페이지 리디렉션
    }, 1000); // 애니메이션 시간에 맞게 조절 필요
}

function addFeedEffect3() {
    var foodImage = $(".item-img3"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    foodImage.addClass("animate-towards-turtle3");

    // 효과음 재생
    var feedSound = document.getElementById("feedSound");
    feedSound.play();

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(function() {
        foodImage.removeClass("animate-towards-turtle3");
        location.href = "/user/turtle"; // 애니메이션이 끝난 후 페이지 리디렉션
    }, 1000); // 애니메이션 시간에 맞게 조절 필요
}

function addFeedEffect4() {
    var foodImage = $(".item-img4"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    foodImage.addClass("animate-towards-turtle4");

    // 효과음 재생
    var feedSound = document.getElementById("feedSound");
    feedSound.play();

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(function() {
        foodImage.removeClass("animate-towards-turtle4");
        location.href = "/user/turtle"; // 애니메이션이 끝난 후 페이지 리디렉션
    }, 1000); // 애니메이션 시간에 맞게 조절 필요
}





