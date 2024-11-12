document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function generarNRZ(bits, voltajeAlto, voltajeBajo) {
        const data = [];
        for (let i = 0; i < bits.length; i++) {
            data.push(bits[i] === '1' ? voltajeAlto : voltajeBajo);
        }
        return data;
    }

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeAlto = parseFloat(document.getElementById('voltajeAlto').value);
        const voltajeBajo = parseFloat(document.getElementById('voltajeBajo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const nrzData = generarNRZ(inputBits, voltajeAlto, voltajeBajo);
        const labels = inputBits.split('').map((bit) => bit);

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal NRZ',
                    data: nrzData,
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
