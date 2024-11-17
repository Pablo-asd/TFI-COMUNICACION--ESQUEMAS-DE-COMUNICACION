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
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                    stepped: true,
                },
                {
                    label: 'Línea Base',
                    data: new Array(labels.length).fill(0),
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    pointRadius: 0,
                    borderDash: [5, 5],
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
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