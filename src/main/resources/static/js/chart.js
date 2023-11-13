//bar chart
var bar = document.getElementById('bar');
bar.height = 400
var barConfig = new Chart(bar, {
    type: 'horizontalBar',
    data: {
        labels: ['data-1', 'data-2', 'data-3', 'data-4', 'data-5', 'data-6', 'data-7'],
        datasets: [{
            label: '# of data',
            data: [30, 25, 20, 15, 11, 4, 2],
            backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(225, 50, 64, 1)', 'rgba(64, 159, 64, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    }
})
//bubble chart
var bubble = document.getElementById('bubble');
bubble.height = 200
var myBubbleChart = new Chart(bubble, {
    type: 'bubble',
    data: {
        labels: ['data-1', 'data-2', 'data-3', 'data-4', 'data-5', 'data-6', 'data-7'],
        datasets: [{
            label: '# of data',
            data: [{
                x: 20,
                y: 10,
                r: 10
            }, {
                x: 15,
                y: 5,
                r: 13
            }, {
                x: 12,
                y: 4,
                r: 8
            }, {
                x: 17,
                y: 2,
                r: 10
            }, {
                x: 10,
                y: 9,
                r: 15
            }, {
                x: 8,
                y: 8,
                r: 12
            }, {
                x: 16,
                y: 9,
                r: 8
            }],
            backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(225, 50, 64, 1)', 'rgba(64, 159, 64, 1)', ]
        }]
    },
    options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false,
    }
});
//doughnut chart
var doughnut = document.getElementById('doughnut');
var doughnutConfig = new Chart(doughnut, {
    type: 'doughnut',
    data: {
        labels: ['data-1', 'data-2', 'data-3'],
        datasets: [{
            label: '# of data',
            data: [11, 30, 20],
            backgroundColor: ['rgba(0, 230, 118, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255,99,132,1)'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: true, // Add to prevent default behaviour of full-width/height
    }
});
//line chart
var line = document.getElementById('line');
line.height = 200
var lineConfig = new Chart(line, {
    type: 'line',
    data: {
        labels: ['data-1', 'data-2', 'data-3', 'data-4', 'data-5', 'data-6'],
        datasets: [{
            label: '# of data', // Name the series
            data: [10, 15, 20, 10, 25, 5, 10], // Specify the data values array
            fill: false,
            borderColor: '#2196f3', // Add custom color border (Line)
            backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
            borderWidth: 1 // Specify bar border width
        }]
    },
    options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    }
})
//pie chart
var pie = document.getElementById('pie');
var pieConfig = new Chart(pie, {
    type: 'pie',
    data: {
        labels: ['Normal', 'Abnormal'],
        datasets: [{
            label: '# of data',
            data: [(totalNormal * 100 / (totalAbnormal + totalNormal)), (totalAbnormal * 100 / (totalAbnormal + totalNormal))],
            backgroundColor: ['rgba(103, 216, 239, 1)', 'rgba(246, 26, 104,1)'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
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

const ctx = document.getElementById('postureChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Normal Posture',
            data: normalData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }, {
            label: 'Abnormal Posture',
            data: abnormalData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
        labels: ["January", "February", "March", "April", 'May', 'June', 'August', 'September'],
        datasets: [{
            label: "Lost",
            data: [45, 25, 40, 20, 60, 20, 35, 25],
            backgroundColor: "#0d6efd",
            borderColor: 'transparent',
            borderWidth: 2.5,
            barPercentage: 0.4,
        }, {
            label: "Succes",
            startAngle: 2,
            data: [20, 40, 20, 50, 25, 40, 25, 10],
            backgroundColor: "#dc3545",
            borderColor: 'transparent',
            borderWidth: 2.5,
            barPercentage: 0.4,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                gridLines: {},
                ticks: {
                    stepSize: 15,
                },
            }],
            xAxes: [{
                gridLines: {
                    display: false,
                }
            }]
        }
    }
})


