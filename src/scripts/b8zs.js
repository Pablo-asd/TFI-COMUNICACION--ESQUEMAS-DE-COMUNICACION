import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarB8ZS } from '../codificadores/cod_b8zs.js';

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

        const bitsConExtra = inputBits + '0';
        const b8zsData = generarB8ZS(bitsConExtra, voltajeInicial);
        const labels = [...inputBits.split(''), ''];

        if (chart) chart.destroy();

        const ctx = document.getElementById('b8zsChart').getContext('2d');
        const config = createChartConfig(b8zsData, labels, 'Señal B8ZS');
        
        // Agregar límites dinámicos
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min;
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max;
        };

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

    // Inicializar tamaños
    actualizarTamanoGraficos();
});