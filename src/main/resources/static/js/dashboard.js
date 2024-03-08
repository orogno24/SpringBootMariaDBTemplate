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

var pie2 = document.getElementById('pie2');
var pieConfig = new Chart(pie2, {
    type: 'pie',
    data: {
        labels: ['정상 자세', '거북목 자세'],
        datasets: [{
            label: '# of data',
            data: [(totalNormal2 * 100 / (totalAbnormal2 + totalNormal2)), (totalAbnormal2 * 100 / (totalAbnormal2 + totalNormal2))],
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

var ctx2 = document.getElementById('timeUsageChart');
const normalRatioData = normalData2.map((normal, index) => {
    const total = normal + abnormalData2[index];
    return total > 0 ? (normal * 100 / total) : 0;
});
var lineConfig = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: labels2,
        datasets: [{
            label: '정상 사용 시간 비율 (%)',
            data: normalRatioData,
            fill: false,
            borderColor: "#55e7ff",
            backgroundColor: '#ff4f70',
            borderWidth: 3
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
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 100
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

var ctx3 = document.getElementById('MinuteChart');
const normalRatioData3 = normalData3.map((normal, index) => {
    const total = normal + abnormalData3[index];
    return total > 0 ? (normal * 100 / total) : 0;
});
var lineConfig = new Chart(ctx3, {
    type: 'line',
    data: {
        labels: labels3,
        datasets: [{
            label: '정상 사용 시간 비율 (%)',
            data: normalRatioData3,
            fill: false,
            borderColor: "#55e7ff",
            borderWidth: 3
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
        },
        legend: {
            labels: {
                fontFamily: 'NIXGONM-Vb',
                fontSize: 13
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    stepSize: 20
                }
            }]
        }
    }
});

var ctx5 = document.getElementById('FiveChart');
const normalRatioData5 = normalData5.map((normal, index) => {
    const total = normal + abnormalData5[index];
    return total > 0 ? (normal * 100 / total) : 0;
});
var lineConfig = new Chart(ctx5, {
    type: 'line',
    data: {
        labels: labels5,
        datasets: [{
            label: '정상 자세 유지 비율 (%)',
            data: normalRatioData5,
            fill: false,
            borderColor: "#55e7ff",
            borderWidth: 3
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
        },
        legend: {
            labels: {
                fontFamily: 'NIXGONM-Vb',
                fontSize: 13
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    stepSize: 20
                }
            }]
        }
    }
});

