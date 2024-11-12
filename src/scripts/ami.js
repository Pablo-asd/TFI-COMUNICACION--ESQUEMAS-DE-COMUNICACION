document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function generarAMI(bits, voltajePositivo, voltajeNegativo) {
        const data = [];
        let ultimoPulsoPositivo = true;
        
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') {
                if (ultimoPulsoPositivo) {
                    data.push(voltajeNegativo);
                    ultimoPulsoPositivo = false;
                } else {
                    data.push(voltajePositivo);
                    ultimoPulsoPositivo = true;
                }
            } else {
                data.push(0);
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

        const amiData = generarAMI(inputBits, voltajePositivo, voltajeNegativo);
        const labels = inputBits.split('').map((bit) => bit);

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('amiChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal AMI',
                    data: amiData,
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
                    }
                },
                scales: {
                    x: {
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