import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarManchester } from '../codificadores/cod_manchester.js';

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
        const manchesterData = generarManchester(bitsConExtra, voltajeInicial);
        const labels = bitsConExtra.split('').map(bit => [bit, bit]).flat();
        labels[labels.length - 2] = 'x';
        labels[labels.length - 1] = '';

        if (chart) chart.destroy();

        const ctx = document.getElementById('manchesterChart').getContext('2d');
        const config = createChartConfig(manchesterData, labels, 'Señal Manchester');
        
        // Personalizar la configuración para mostrar solo etiquetas pares
        config.options.scales.x.ticks.callback = function(value, index) {
            return index % 2 === 0 ? this.getLabelForValue(value) : '';
        };
        
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