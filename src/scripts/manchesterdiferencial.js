document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function calcularLimites(data) {
        const maxAbs = Math.max(Math.abs(Math.max(...data)), Math.abs(Math.min(...data)));
        return {
            min: -maxAbs,
            max: maxAbs
        };
    }

    function generarManchesterDiferencial(bits, voltajeAlto, voltajeBajo) {
        const data = [];
        let transicionPrevia = true; // true para transición ascendente, false para descendente
        
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '0') {
                // Para 0, mantener la misma transición que el bit anterior
                if (transicionPrevia) {
                    data.push(voltajeBajo);
                    data.push(voltajeAlto);
                } else {
                    data.push(voltajeAlto);
                    data.push(voltajeBajo);
                }
            } else {
                // Para 1, invertir la transición
                if (transicionPrevia) {
                    data.push(voltajeAlto);
                    data.push(voltajeBajo);
                    transicionPrevia = false;
                } else {
                    data.push(voltajeBajo);
                    data.push(voltajeAlto);
                    transicionPrevia = true;
                }
            }
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
        const manchesterDifData = generarManchesterDiferencial(bitsConExtra, voltajeAlto, voltajeBajo);
        const labels = bitsConExtra.split('').map(bit => [bit, bit]).flat();
        labels[labels.length - 2] = 'x';
        labels[labels.length - 1] = '';

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('manchesterDifferentialChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal Manchester Diferencial',
                    data: manchesterDifData,
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
                            },
                            callback: function(value, index) {
                                return index % 2 === 0 ? this.getLabelForValue(value) : '';
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