document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function calcularLimites(data) {
        const maxAbs = Math.max(Math.abs(Math.max(...data)), Math.abs(Math.min(...data)));
        return {
            min: -maxAbs,
            max: maxAbs
        };
    }

    function generarNRZI(bits, voltajeAlto, voltajeBajo) {
        const data = [];
        let nivelActual = voltajeAlto; // Comenzamos con nivel alto

        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') {
                // Cambiar nivel
                nivelActual = (nivelActual === voltajeAlto) ? voltajeBajo : voltajeAlto;
            }
            data.push(nivelActual);
        }
        return data;
    }

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeAlto = parseFloat(document.getElementById('voltajePositivo').value);
        const voltajeBajo = parseFloat(document.getElementById('voltajeNegativo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        const nrziData = generarNRZI(bitsConExtra, voltajeAlto, voltajeBajo);
        const labels = [...inputBits.split(''), 'x'];

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzIChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal NRZ-I',
                    data: nrziData,
                    borderColor: '#00FFFF',  // Color celeste eléctrico
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