class NRZIEncoder {
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
        
        // Iniciar con voltaje positivo
        let currentVoltage = voltajePositivo;
        data.push(currentVoltage);

        for (let i = 0; i < bitSequence.length; i++) {
            labels.push(`Bit ${i}`);

            if (bitSequence[i] === '1') {
                currentVoltage = (currentVoltage === voltajePositivo) ? 
                    voltajeNegativo : voltajePositivo;
            }
            data.push(currentVoltage);
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

        const ctx = document.getElementById('nrzIChart').getContext('2d');
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
const nrzIEncoder = new NRZIEncoder();