document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function generarManchester(bits, voltajeAlto, voltajeBajo) {
        const data = [];
        
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') {
                // Para 1: transición de positivo a negativo
                data.push(voltajeAlto);
                data.push(voltajeBajo);
            } else {
                // Para 0: transición de negativo a positivo
                data.push(voltajeBajo);
                data.push(voltajeAlto);
            }
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

        const manchesterData = generarManchester(inputBits, voltajeAlto, voltajeBajo);
        // Crear etiquetas duplicadas para mantener la alineación con los datos
        const labels = inputBits.split('').map(bit => [bit, bit]).flat();

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('manchesterChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal Manchester',
                    data: manchesterData,
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
                            },
                            // Mostrar solo un número por bit
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
                        }
                    }
                }
            }
        });
    }

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
});