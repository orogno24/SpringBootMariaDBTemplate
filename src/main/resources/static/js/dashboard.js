var pie = document.getElementById('pie');
var pieConfig = new Chart(pie, {
    type: 'pie',
    data: {
        labels: ['Normal', 'Abnormal'],
        datasets: [{
            label: '# of data',
            data: [(totalNormal * 100 / (totalAbnormal + totalNormal)), (totalAbnormal * 100 / (totalAbnormal + totalNormal))],
            backgroundColor: ['#55e7ff', '#3399ad'],
            borderColor: 'transparent',
            borderWidth: 2
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
            backgroundColor: "#55e7ff",
            borderColor: 'transparent',
            borderWidth: 1
        }, {
            label: 'Abnormal Posture',
            data: abnormalData,
            backgroundColor: "#3aa8be",
            borderColor: 'transparent',
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

var pie2 = document.getElementById('pie2');
var pieConfig = new Chart(pie2, {
    type: 'pie',
    data: {
        labels: ['Normal', 'Abnormal'],
        datasets: [{
            label: '# of data',
            data: [3, 2],
            backgroundColor: ['#55e7ff', '#3399ad'],
            borderColor: 'transparent',
            borderWidth: 2
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
            borderColor: '#55e7ff', // Add custom color border (Line)
            backgroundColor: '#3399ad', // Add custom color background (Points and Fill)
            borderWidth: 2 // Specify bar border width
        }]
    },
    options: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    }
})
