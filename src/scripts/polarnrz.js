import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZI } from '../codificadores/cod_nrz_i.js';
import { generarNRZL } from '../codificadores/cod_nrz_l.js';

document.addEventListener('DOMContentLoaded', function() {
    let nrzlChart = null;
    let nrziChart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        
        // Actualizar valores mostrados
        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;
        
        // Actualizar contenedor
        const timeContainer = document.getElementById('timeChartContainer');
        timeContainer.style.width = `${width}%`;
        timeContainer.style.height = `${height}px`;

        // Si hay gráficos, actualizarlos
        if (nrzlChart || nrziChart) {
            actualizarGraficos();
        }
    }

    function actualizarGraficos() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);
        const displayType = document.querySelector('input[name="displayType"]:checked').value;

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        // Crear labels alineados con el centro de cada intervalo
        const labels = Array(inputBits.length * 2 + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i]; // Posiciona los bits en medio de las líneas verticales
        }

        // Crear anotaciones para las líneas verticales
        const annotations = {};
        for (let i = 0; i <= inputBits.length; i++) {
            annotations[`line${i}`] = {
                type: 'line',
                xMin: i * 2,
                xMax: i * 2,
                yMin: -voltajeInicial * 1.5,
                yMax: voltajeInicial * 1.5,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1,
                borderDash: [5, 5],
                drawTime: 'beforeDatasetsDraw'
            };
        }

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return labels[value] || '';
                        },
                        maxRotation: 0,
                        color: 'white',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        ...annotations,
                        zeroline: {
                            type: 'line',
                            yMin: 0,
                            yMax: 0,
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            borderWidth: 1,
                            borderDash: [5, 5],
                            drawTime: 'beforeDatasetsDraw'
                        }
                    }
                }
            }
        };

        if (nrzlChart) nrzlChart.destroy();
        if (nrziChart) nrziChart.destroy();

        if (displayType === 'nrzl' || displayType === 'both') {
            const nrzlData = generarNRZL(inputBits, voltajeInicial);
            const ctx1 = document.getElementById('polarNRZLChart').getContext('2d');
            const config1 = createChartConfig(nrzlData, labels, 'Señal Polar NRZ-L');
            config1.options = { ...config1.options, ...commonOptions };
            nrzlChart = new Chart(ctx1, config1);
        }

        if (displayType === 'nrzi' || displayType === 'both') {
            const nrziData = generarNRZI(inputBits, voltajeInicial);
            const ctx2 = document.getElementById('polarNRZIChart').getContext('2d');
            const config2 = createChartConfig(nrziData, labels, 'Señal Polar NRZ-I');
            config2.options = { ...config2.options, ...commonOptions };
            nrziChart = new Chart(ctx2, config2);
        }

        actualizarLayoutGraficas();
    }

    function actualizarLayoutGraficas() {
        const displayType = document.querySelector('input[name="displayType"]:checked').value;
        const nrzlWrapper = document.querySelector('.chart-wrapper:first-child');
        const nrziWrapper = document.querySelector('.chart-wrapper:last-child');
        const container = document.getElementById('timeChartContainer');
        
        // Aseguramos que el contenedor principal tenga el ancho correcto
        const width = document.getElementById('chartWidth').value;
        container.style.width = `${width}%`;
        
        switch(displayType) {
            case 'nrzl':
                nrzlWrapper.style.display = 'block';
                nrziWrapper.style.display = 'none';
                nrzlWrapper.style.width = '100%';
                break;
            case 'nrzi':
                nrzlWrapper.style.display = 'none';
                nrziWrapper.style.display = 'block';
                nrziWrapper.style.width = '100%';
                break;
            case 'both':
                nrzlWrapper.style.display = 'block';
                nrziWrapper.style.display = 'block';
                nrzlWrapper.style.width = '49%';
                nrziWrapper.style.width = '49%';
                container.style.justifyContent = 'space-between';
                break;
        }

        // Forzar actualización de tamaño
        requestAnimationFrame(() => {
            if (nrzlChart) nrzlChart.resize();
            if (nrziChart) nrziChart.resize();
        });
    }

    // Event Listeners
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGraficos);
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    
    // Establecer ancho inicial y actualizar layout
    document.getElementById('chartWidth').value = 100;
    actualizarTamanoGraficos();
    actualizarLayoutGraficas();

    // Agregar event listener para los radio buttons
    document.querySelectorAll('input[name="displayType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (nrzlChart || nrziChart) {
                actualizarLayoutGraficas();
            }
        });
    });

    // Agregar evento para la tecla Enter
    document.getElementById('inputBits').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            actualizarGraficos();
        }
    });
});