var exp = 70;

function updateExpBar(exp) {
    var expBar = document.getElementById("expBar");
    expBar.style.width = exp + '%';
}

updateExpBar(exp);