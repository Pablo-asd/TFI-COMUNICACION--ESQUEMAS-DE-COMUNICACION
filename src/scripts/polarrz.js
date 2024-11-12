class PolarRZEncoder {
    constructor() {
        this.chart = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const btnGenerar = document.getElementById('btnGenerar');
            btnGenerar.addEventListener('click', () => this.generarGrafico());

            const inputBits = document.getElementById('inputBits');
            inputBits.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.generarGrafico();
                }
            });
        });
    }

    validarEntrada(bitSequence) {
        if (!/^[01]+$/.test(bitSequence)) {
            alert('Por favor ingrese solo 1s y 0s');
            return false;
        }
        return true;
    }

    generarDatos(bitSequence, voltajePositivo, voltajeNegativo) {
        const data = [];
        const labels = [];

        for (let i = 0; i < bitSequence.length; i++) {
            // Inicio del bit
            labels.push(`Bit ${i} Start`);
            data.push(bitSequence[i] === '1' ? voltajePositivo : voltajeNegativo);

            // Mitad del bit (regreso a cero)
            labels.push(`Bit ${i} Mid`);
            data.push(0);

            // Final del bit
            labels.push(`Bit ${i} End`);
            data.push(0);
        }

        return { data, labels };
    }

    generarGrafico() {
        const bitSequence = document.getElementById('inputBits').value;
        const voltajePositivo = parseFloat(document.getElementById('voltajePositivo').value);
        const voltajeNegativo = parseFloat(document.getElementById('voltajeNegativo').value);

        if (!this.validarEntrada(bitSequence)) return;

        const { data, labels } = this.generarDatos(bitSequence, voltajePositivo, voltajeNegativo);

        // Destruir el gráfico anterior si existe
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = document.getElementById('polarRZChart').getContext('2d');
        this.chart = new Chart(ctx, {
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
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: Math.min(voltajeNegativo, -1) * 1.2,
                        max: Math.max(voltajePositivo, 1) * 1.2,
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
}

// Inicializar el codificador
const polarRZEncoder = new PolarRZEncoder();