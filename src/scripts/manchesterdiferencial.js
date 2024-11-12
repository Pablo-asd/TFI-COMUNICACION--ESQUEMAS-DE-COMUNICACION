document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

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
        const voltajeAlto = parseFloat(document.getElementById('voltajeAlto').value);
        const voltajeBajo = parseFloat(document.getElementById('voltajeBajo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const manchesterDifData = generarManchesterDiferencial(inputBits, voltajeAlto, voltajeBajo);
        // Crear etiquetas duplicadas para mantener la alineación con los datos
        const labels = inputBits.split('').map(bit => [bit, bit]).flat();

        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('manchesterDifChart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal Manchester Diferencial',
                    data: manchesterDifData,
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
// Inicializar el codificador
const manchesterDiferencialEncoder = new ManchesterDiferencialEncoder();