document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

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
        const voltajeAlto = parseFloat(document.getElementById('voltajeAlto').value);
        const voltajeBajo = parseFloat(document.getElementById('voltajeBajo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const nrziData = generarNRZI(inputBits, voltajeAlto, voltajeBajo);
        // Crear las etiquetas usando los bits ingresados
        const labels = inputBits.split('').map((bit) => bit);

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrziChart').getContext('2d');
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