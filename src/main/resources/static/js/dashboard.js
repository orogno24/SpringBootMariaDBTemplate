var pie = document.getElementById('pie');
var pieConfig = new Chart(pie, {
    type: 'pie',
    data: {
        labels: ['Normal', 'Abnormal'],
        datasets: [{
            label: '# of data',
            data: [(totalNormal * 100 / (totalAbnormal + totalNormal)), (totalAbnormal * 100 / (totalAbnormal + totalNormal))],
            backgroundColor: ['#15c6e5', '#505162'],
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
            backgroundColor: "#15c6e5",
            borderColor: 'transparent',
            borderWidth: 1
        }, {
            label: 'Abnormal Posture',
            data: abnormalData,
            backgroundColor: "#505162",
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