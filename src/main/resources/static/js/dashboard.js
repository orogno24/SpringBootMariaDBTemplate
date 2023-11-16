var pie = document.getElementById('pie');
var pieConfig = new Chart(pie, {
    type: 'pie',
    data: {
        labels: ['정상 자세', '거북목 자세'],
        datasets: [{
            label: '# of data',
            data: [(totalNormal * 100 / (totalAbnormal + totalNormal)), (totalAbnormal * 100 / (totalAbnormal + totalNormal))],
            backgroundColor: ['#55e7ff', '#ff4f70'],
            borderColor: 'transparent',
            borderWidth: 2
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20
            }
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index] || '';
                    if (label) {
                        label += ': ';
                    }
                    var value = data.datasets[0].data[tooltipItem.index];
                    label += Math.round(value) + '%'; // 여기서 반올림
                    return label;
                }
            }
        },
        legend: {
            labels: {
                fontFamily: 'NIXGONM-Vb',
                fontSize: 13 // 원하는 글꼴 크기
            }
        }
    }
});


const ctx = document.getElementById('postureChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: '정상 자세',
            data: normalData,
            backgroundColor: "#55e7ff",
            borderColor: 'transparent',
            borderWidth: 1
        }, {
            label: '거북목 자세',
            data: abnormalData,
            backgroundColor: "#ff4f70",
            borderColor: 'transparent',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        legend: {
            labels: {
                fontFamily: 'NIXGONM-Vb',
                fontSize: 13 // 원하는 글꼴 크기
            }
        }

    }
});


var pie2 = document.getElementById('pie2');
var pieConfig = new Chart(pie2, {
    type: 'pie',
    data: {
        labels: ['정상 자세', '거북목 자세'],
        datasets: [{
            label: '# of data',
            data: [3, 2],
            backgroundColor: ['#55e7ff', '#ff4f70'],
            borderColor: 'transparent',
            borderWidth: 2
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 20
            }
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index] || '';
                    if (label) {
                        label += ': ';
                    }
                    var value = data.datasets[0].data[tooltipItem.index];
                    label += Math.round(value) + '%'; // 여기서 반올림
                    return label;
                }
            }
        },
        legend: {
            labels: {
                fontFamily: 'NIXGONM-Vb',
                fontSize: 13 // 원하는 글꼴 크기
            }
        }
    }
});

var line = document.getElementById('line');
var lineConfig = new Chart(line, {
    type: 'line',
    data: {
        labels: ['data-1', 'data-2', 'data-3', 'data-4', 'data-5', 'data-6'],           // 시간별로 들어가야함
        datasets: [{
            label: '시간대별 자세 비율', //
            data: [0, 15, 20, 10, 25, 5], //          // 시간별 정상 / 거북목 비율
            fill: false,
            borderColor: '#55e7ff', //
            backgroundColor: '#ff4f70', //
            borderWidth: 3 //
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.labels[tooltipItem.index] || '';
                    if (label) {
                        label += ': ';
                    }
                    var value = data.datasets[0].data[tooltipItem.index];
                    label += Math.round(value) + '%'; // 여기서 반올림
                    return label;
                }
            }
        }
    }
});