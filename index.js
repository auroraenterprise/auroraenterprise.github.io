$(function() {
    var gradient = $("#displayChart")[0].getContext("2d").createLinearGradient(0, 0, 0, window.innerHeight / 4);
    
    gradient.addColorStop(0, "rgba(53, 189, 231, 0.9)");
    gradient.addColorStop(1, "rgba(142, 207, 112, 0.6)");

    var displayChart = new Chart("displayChart", {
        type: "line",
        data: {
            labels: Array(10).fill(0),
            datasets: [{
                data: Array.from({length: 10}, function() {
                    return Math.random() + 0.25;
                }),
                backgroundColor: gradient,
                borderColor: "rgba(53, 189, 231, 1)",
                borderWidth: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0
                }
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    } 
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        display: false
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }]
            }
        }
    });
});