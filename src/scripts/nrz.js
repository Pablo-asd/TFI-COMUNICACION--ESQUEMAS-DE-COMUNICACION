document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón y agregar el evento click
    const btnGenerar = document.getElementById('btnGenerar');
    btnGenerar.addEventListener('click', generarGraficoNRZ);
    
    // Opcional: también puedes agregar el evento para cuando el usuario presione Enter en el input
    const inputBits = document.getElementById('inputBits');
    inputBits.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generarGraficoNRZ();
        }
    });
});

// Reemplazar la línea de bitSequence fija con una función que obtenga el input del usuario
function generarGraficoNRZ() {
    const bitSequence = document.getElementById('inputBits').value;
    const data = [];
    const labels = [];
    
    // Validar que solo contenga 1s y 0s
    if (!/^[01]+$/.test(bitSequence)) {
        alert('Por favor ingrese solo 1s y 0s');
        return;
    }

    // Generar los datos de voltaje y etiquetas para cada bit
    for (let i = 0; i < bitSequence.length; i++) {
        const voltage = bitSequence[i] === '1' ? 5 : 0;
        data.push(voltage);
        labels.push(`Bit ${i}`);
    }

        // Configuración del gráfico
        const ctx = document.getElementById('nrzChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Señal [Nombre]',
                    data: data,
                    borderColor: '#00FFFF', // Celeste eléctrico
                    borderWidth: 3,
                    fill: false,
                    stepped: true
                }]


            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 7, // Máximo en el eje Y a +5V
                        title: {
                            display: true,
                            text: 'Voltaje (V)'
                        },
                        ticks: {
                            stepSize: 1
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Bits'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `Voltaje: ${context.raw}V`;
                            }
                        }
                    }
                }
            }
        });
}
