document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function generarHDB3(bits, voltajePositivo, voltajeNegativo) {
        const data = [];
        let contadorCeros = 0;
        let ultimoPulsoPositivo = true;
        let ultimaViolacionPositiva = true;
        let contadorUnos = 0;

        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '0') {
                contadorCeros++;
                if (contadorCeros === 4) {
                    // Insertar violación B00V
                    data[data.length - 3] = 0;
                    data[data.length - 2] = 0;
                    data[data.length - 1] = 0;
                    
                    if (contadorUnos % 2 === 0) {
                        // Necesitamos B00V
                        data.push(ultimaViolacionPositiva ? voltajeNegativo : voltajePositivo);
                        data[data.length - 4] = ultimaViolacionPositiva ? voltajeNegativo : voltajePositivo;
                        ultimaViolacionPositiva = !ultimaViolacionPositiva;
                    } else {
                        // Solo necesitamos 000V
                        data.push(ultimoPulsoPositivo ? voltajePositivo : voltajeNegativo);
                        ultimoPulsoPositivo = !ultimoPulsoPositivo;
                    }
                    contadorCeros = 0;
                } else {
                    data.push(0);
                }
            } else { // bit es '1'
                contadorCeros = 0;
                contadorUnos++;
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
        const hdb3Data = generarHDB3(bitsConExtra, voltajePositivo, voltajeNegativo);
        const labels = [...inputBits.split(''), 'x'];

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('hdb3Chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal HDB3',
                    data: hdb3Data,
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
                        }
                    }
                }
            }
        });
    }

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
});