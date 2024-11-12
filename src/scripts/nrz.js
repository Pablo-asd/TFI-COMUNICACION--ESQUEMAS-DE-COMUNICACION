document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón y agregar el evento click
    const btnGenerar = document.getElementById('btnGenerar');
    btnGenerar.addEventListener('click', actualizarGrafico);
    
    // Opcional: también puedes agregar el evento para cuando el usuario presione Enter en el input
    const inputBits = document.getElementById('inputBits');
    inputBits.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            actualizarGrafico();
        }
    });
});

function actualizarGrafico() {
    const inputBits = document.getElementById('inputBits').value.trim();
    const voltajeAlto = parseFloat(document.getElementById('voltajeAlto').value);
    const voltajeBajo = parseFloat(document.getElementById('voltajeBajo').value);

    if (!/^[01]+$/.test(inputBits)) {
        alert('Por favor, ingrese solo 1s y 0s');
        return;
    }

    const nrzData = generarNRZ(inputBits, voltajeAlto, voltajeBajo);
    // Crear las etiquetas usando los bits ingresados
    const labels = inputBits.split('').map((bit) => bit);

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('nrzChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,  // Usamos los bits como etiquetas
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
