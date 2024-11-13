document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function calcularLimites(data) {
        const maxAbs = Math.max(Math.abs(Math.max(...data)), Math.abs(Math.min(...data)));
        return {
            min: -maxAbs,
            max: maxAbs
        };
    }

    function generarB8ZS(bits, voltajePositivo, voltajeNegativo) {
        const data = [];
        let contadorCeros = 0;
        let ultimoPulsoPositivo = true;

        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '0') {
                contadorCeros++;
                if (contadorCeros === 8) {
                    // Reemplazar los últimos 8 ceros con la secuencia B8ZS
                    data[data.length - 7] = 0;
                    data[data.length - 6] = 0;
                    data[data.length - 5] = 0;
                    
                    if (ultimoPulsoPositivo) {
                        // 000+-0-+
                        data[data.length - 4] = voltajePositivo;
                        data[data.length - 3] = voltajeNegativo;
                        data[data.length - 2] = 0;
                        data[data.length - 1] = voltajeNegativo;
                        data.push(voltajePositivo);
                    } else {
                        // 000-+0+-
                        data[data.length - 4] = voltajeNegativo;
                        data[data.length - 3] = voltajePositivo;
                        data[data.length - 2] = 0;
                        data[data.length - 1] = voltajePositivo;
                        data.push(voltajeNegativo);
                    }
                    contadorCeros = 0;
                } else {
                    data.push(0);
                }
            } else { // bit es '1'
                contadorCeros = 0;
                if (ultimoPulsoPositivo) {
                    data.push(voltajeNegativo);
                    ultimoPulsoPositivo = false;
                } else {
                    data.push(voltajePositivo);
                    ultimoPulsoPositivo = true;
                }
            }
        }
        return data;
    }

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajePositivo = parseFloat(document.getElementById('voltajePositivo').value);
        const voltajeNegativo = parseFloat(document.getElementById('voltajeNegativo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        const b8zsData = generarB8ZS(bitsConExtra, voltajePositivo, voltajeNegativo);
        const labels = [...inputBits.split(''), 'x'];

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('b8zsChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal B8ZS',
                    data: b8zsData,
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
                        drawTime: 'afterDatasetsDraw',
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 0,
                                yMax: 0,
                                borderColor: '#ffffff',
                                borderWidth: 1.5,
                                borderDash: [5, 5],
                                drawTime: 'afterDraw'
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 18,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
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
                        },
                        min: function(context) {
                            const limites = calcularLimites(context.chart.data.datasets[0].data);
                            return limites.min;
                        },
                        max: function(context) {
                            const limites = calcularLimites(context.chart.data.datasets[0].data);
                            return limites.max;
                        }
                    }
                }
            }
        });
    }

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
});