import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarPolarRZ } from '../codificadores/cod_polar_rz.js';

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

        // Validar entrada
        if (!inputBits) {
            alert('Por favor, ingrese una secuencia de bits');
            return;
        }

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        let polarRZData = generarPolarRZ(bitsConExtra, voltajeInicial);
        
        // Modificar el último segmento para mostrar solo hasta el punto donde cruza el cero
        const longitudSegmento = 2; // Cada bit ocupa 2 puntos
        const ultimoIndice = polarRZData.length - longitudSegmento + Math.floor(longitudSegmento/4); // Mostrar solo 1/4 del último segmento
        polarRZData = polarRZData.slice(0, ultimoIndice);
        
        // Asegurarse de que el último punto sea cero
        if (polarRZData.length > 0) {
            polarRZData[polarRZData.length - 1] = 0;
        }
        
        // Generar etiquetas
        const labels = bitsConExtra.split('').map(bit => [bit, bit]).flat();
        // Cambiar las últimas dos etiquetas por cadenas vacías
        labels[labels.length - 2] = '';
        labels[labels.length - 1] = '';

        if (chart) chart.destroy();

        const ctx = document.getElementById('polarRZChart').getContext('2d');
        const config = createChartConfig(polarRZData, labels, 'Señal Polar RZ');
        
        // Personalizar la configuración para mostrar solo etiquetas de bits (pares)
        config.options.scales.x.ticks.callback = function(value, index) {
            // Mostrar solo las etiquetas en posiciones pares y que no sean las últimas dos
            return index % 2 === 0 && index < labels.length - 2 ? this.getLabelForValue(value) : '';
        };
        
        // Agregar límites dinámicos
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min - 1;
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1;
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
    document.getElementById('chartWidth').value = 100;
    // Inicializar tamaños
    actualizarTamanoGraficos();
});