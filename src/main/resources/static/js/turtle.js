
function addFeedEffect() {
    var foodImage = $(".item-img"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    foodImage.addClass("animate-towards-turtle");

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(function() {
        foodImage.removeClass("animate-towards-turtle");
        location.href = "/user/turtle"; // 애니메이션이 끝난 후 페이지 리디렉션
    }, 1000); // 애니메이션 시간에 맞게 조절 필요
}

function addFeedEffect2() {
    var foodImage = $(".item-img2"); // 먹이 이미지의 클래스나 ID에 따라 수정 필요
    foodImage.addClass("animate-towards-turtle2");

    // 애니메이션이 끝나면 클래스 제거
    setTimeout(function() {
        foodImage.removeClass("animate-towards-turtle2");
        location.href = "/user/turtle"; // 애니메이션이 끝난 후 페이지 리디렉션
    }, 1000); // 애니메이션 시간에 맞게 조절 필요
}





