export const createChartConfig = (data, labels, title) => ({
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: title,
            data: data,
            borderColor: '#00FFFF',
            borderWidth: 3,
            fill: false,
            stepped: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: 1500,
                from: 0,
                delay(ctx) {
                    return ctx.dataIndex * 150;
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 16
                    }
                }
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 0,
                        yMax: 0,
                        borderColor: '#ffffff',
                        borderWidth: 1.5,
                        borderDash: [5,5]
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                }
            },
            y: {
                grid: { display: false },
                border: {
                    color: '#ffffff',
                    width: 2
                },
                ticks: {
                    color: '#ffffff',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    }
});

export const calcularLimites = (data) => {
    const maxAbs = Math.max(Math.abs(Math.max(...data)), Math.abs(Math.min(...data)));
    return {
        min: -maxAbs,
        max: maxAbs
    };
}; 