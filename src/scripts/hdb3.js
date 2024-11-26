import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarHDB3 } from '../codificadores/cod_hdb3.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    // Función para actualizar el tamaño de los contenedores
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

        // Si el gráfico existe, actualizarlo
        if (chart) chart.resize();
    }

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const hdb3Data = generarHDB3(inputBits, voltajeInicial);
        
        // Crear etiquetas alineadas con los bits (entre líneas punteadas)
        const labels = new Array(hdb3Data.length).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i];  // Colocar bits entre líneas punteadas
        }

        if (chart) chart.destroy();

        const ctx = document.getElementById('hdb3Chart').getContext('2d');
        const config = createChartConfig(hdb3Data, labels, 'Señal HDB3', voltajeInicial);
        
        config.options.scales.x = {
            grid: {
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                color: (context) => {
                    // Mostrar líneas verticales solo en las posiciones de transición
                    return context.index % 2 === 0 ? '#ddd' : 'transparent';
                },
                borderDash: [5, 5], // Línea punteada
                lineWidth: 1
            },
            ticks: {
                display: true,
                autoSkip: false,
                align: 'center'
            }
        };

        config.options.scales.y = {
            min: -voltajeInicial * 1.5,
            max: voltajeInicial * 1.5,
            grid: {
                display: true,
                drawOnChartArea: true,
                color: (context) => {
                    if (context.tick.value === 0) {
                        return '#666'; // Solo mostrar la línea del cero
                    }
                    return 'transparent'; // Ocultar otras líneas horizontales
                },
                borderDash: [5, 5], // Línea punteada para el cero
                lineWidth: 1
            },
            ticks: {
                display: true
            }
        };

        // Configuración de la línea de datos
        config.data.datasets[0].stepped = true;    
        config.data.datasets[0].steppedLine = 'before';  
        config.data.datasets[0].lineTension = 0;
        config.data.datasets[0].pointRadius = 0;
        
        chart = new Chart(ctx, config);
    }

    // Event Listeners
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
    
    // Event Listeners para los controles de tamaño
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartWidth').value = 100;
    // Inicializar tamaños
    actualizarTamanoGraficos();
});