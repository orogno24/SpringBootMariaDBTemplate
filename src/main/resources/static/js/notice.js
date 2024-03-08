var currentPage = 1; // 현재 페이지
var cardsPerPage = 10; // 한 페이지당 보여질 카드 수
var totalCards = 500;
var currentCardsCount = 0;

// 페이지가 로드될 때 초기화
$(document).ready(function () {
    updatePagination();
    showCards();
    $("#btnWrite").on("click", function () {
        location.href = "/notice/noticeReg";
    })
});

// 이전 페이지로 이동
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
        showCards();
    }
}

// 다음 페이지로 이동
function nextPage() {
    if(currentCardsCount <= 9) {
        return;
    }

    var totalPages = Math.ceil(totalCards / cardsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        showCards();
    }
}

// 페이지 번호 업데이트
function updatePagination() {
    var totalPages = Math.ceil(totalCards / cardsPerPage);
    $("#prevPage").prop("disabled", currentPage === 1);
    $("#nextPage").prop("disabled", currentPage === totalPages);
}

// 카드를 보여주는 로직
function showCards() {
    // 모든 카드를 숨깁니다.
    $(".card").hide();

    // 현재 페이지에 해당하는 카드만 보여줍니다.
    var startIndex = (currentPage - 1) * cardsPerPage;
    var endIndex = startIndex + cardsPerPage;

    var currentCards = $(".card").slice(startIndex, endIndex).show();
    currentCardsCount = currentCards.length; // 현재 페이지의 게시물 수를 업데이트
}

function doDetail(seq) {
    location.href = "/notice/noticeInfo?nSeq=" + seq;
}

