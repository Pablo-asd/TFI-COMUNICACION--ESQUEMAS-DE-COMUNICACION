export const createChartConfig = (data, labels, title) => {
    // Calcular los límites base
    const limites = calcularLimites(data);
    const maxAbs = Math.max(Math.abs(limites.min), Math.abs(limites.max));
    
    // Agregar margen adicional (2 unidades más)
    const margenExtra = 2;
    const maxTotal = maxAbs + margenExtra;

    return {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: title,
                    data: data,
                    borderColor: '#00ffff',
                    backgroundColor: '#00ffff',
                    borderWidth: 4,
                    pointRadius: 6,
                    pointBackgroundColor: '#00ffff',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    fill: false,
                    stepped: true,
                    tension: 0,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart',
                x: {
                    type: 'number',
                    easing: 'linear',
                    duration: 1500,
                    from: NaN,
                    delay(ctx) {
                        if (ctx.type !== 'data' || ctx.xStarted) {
                            return 0;
                        }
                        ctx.xStarted = true;
                        return ctx.index * 100;
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    border: {
                        display: true,
                        width: 2
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        zeroline: {
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            drawTime: 'beforeDatasetsDraw'
                        }
                    }
                },
                legend: {
                    labels: {
                        color: 'white',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };
};

export const calcularLimites = (data) => {
    const valores = data.filter(val => val !== null);
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const rango = max - min;
    return {
        max: max + rango * 0.1,
        min: min - rango * 0.1
    };
}; 