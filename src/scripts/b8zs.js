class B8ZSEncoder {
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

    applyB8ZS(data, labels, currentVoltage, voltajePositivo, voltajeNegativo) {
        // Retroceder 8 posiciones para aplicar el patrón B8ZS
        data.splice(-8);
        labels.splice(-8);

        // Aplicar el patrón B8ZS: 000VB0VB
        const b8zsPattern = [
            0, 0, 0,
            currentVoltage,    // V
            -currentVoltage,   // B
            0,
            -currentVoltage,   // V
            currentVoltage     // B
        ];
        
        data.push(...b8zsPattern);
        labels.push(
            'B8ZS 0', 'B8ZS 0', 'B8ZS 0',
            'V', 'B', '0', 'V', 'B'
        );

        return currentVoltage; // Retornar el último voltaje usado
    }

    generarDatos(bitSequence, voltajePositivo, voltajeNegativo) {
        const data = [];
        const labels = [];
        let currentVoltage = voltajePositivo;
        let consecutiveZeros = 0;

        for (let i = 0; i < bitSequence.length; i++) {
            labels.push(`Bit ${i}`);

            if (bitSequence[i] === '1') {
                data.push(currentVoltage);
                currentVoltage = -currentVoltage;
                consecutiveZeros = 0;
            } else {
                data.push(0);
                consecutiveZeros++;

                if (consecutiveZeros === 8) {
                    currentVoltage = this.applyB8ZS(
                        data, 
                        labels, 
                        currentVoltage,
                        voltajePositivo, 
                        voltajeNegativo
                    );
                    consecutiveZeros = 0;
                }
            }
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

        const ctx = document.getElementById('b8zsChart').getContext('2d');
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
const b8zsEncoder = new B8ZSEncoder();