class HDB3Encoder {
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

    applyHDB3Substitution(data, labels, isOddPulseCount, currentVoltage, voltajePositivo, voltajeNegativo) {
        if (isOddPulseCount) {
            // Reemplazo con 'B00V' para número impar de pulsos previos
            data.push(currentVoltage, 0, 0, -currentVoltage);
            labels.push('B (HDB3)', '', '', 'V (HDB3)');
        } else {
            // Reemplazo con '000V' para número par de pulsos previos
            data.push(0, 0, 0, currentVoltage);
            labels.push('', '', '', 'V (HDB3)');
        }
        return -currentVoltage; // Retornar el nuevo voltaje actual
    }

    generarDatos(bitSequence, voltajePositivo, voltajeNegativo) {
        const data = [];
        const labels = [];
        let currentVoltage = voltajePositivo;
        let pulseCount = 0;
        let consecutiveZeros = 0;

        for (let i = 0; i < bitSequence.length; i++) {
            labels.push(`Bit ${i} Start`);
            
            if (bitSequence[i] === '1') {
                if (consecutiveZeros === 4) {
                    currentVoltage = this.applyHDB3Substitution(
                        data, labels, pulseCount % 2 !== 0, 
                        currentVoltage, voltajePositivo, voltajeNegativo
                    );
                    consecutiveZeros = 0;
                } else {
                    data.push(currentVoltage);
                    currentVoltage = -currentVoltage;
                    consecutiveZeros = 0;
                }
                pulseCount++;
            } else {
                data.push(0);
                consecutiveZeros++;

                if (consecutiveZeros === 4) {
                    // Retroceder para aplicar la sustitución HDB3
                    data.splice(-4);
                    currentVoltage = this.applyHDB3Substitution(
                        data, labels, pulseCount % 2 !== 0, 
                        currentVoltage, voltajePositivo, voltajeNegativo
                    );
                    consecutiveZeros = 0;
                }
            }

            labels.push(`Bit ${i} End`);
            data.push(data[data.length - 1]);
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

        const ctx = document.getElementById('hdb3Chart').getContext('2d');
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
const hdb3Encoder = new HDB3Encoder();