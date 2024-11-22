import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarManchesterDiferencial } from '../codificadores/cod_manchester_diferencial.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

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
        let manchesterDifData = generarManchesterDiferencial(bitsConExtra, voltajeInicial);
        
        // Modificar el último segmento para mostrar solo hasta el punto donde cruza el cero
        const longitudSegmento = 2; // Cada bit ocupa 2 puntos
        const ultimoIndice = manchesterDifData.length - longitudSegmento + Math.floor(longitudSegmento/4);
        manchesterDifData = manchesterDifData.slice(0, ultimoIndice);
        
        // Asegurarse de que el último punto sea cero
        if (manchesterDifData.length > 0) {
            manchesterDifData[manchesterDifData.length - 1] = 0;
        }

        const labels = bitsConExtra.split('').map(bit => [bit, bit]).flat();
        labels[labels.length - 2] = '';
        labels[labels.length - 1] = '';

        if (chart) chart.destroy();

        const ctx = document.getElementById('manchesterDifferentialChart').getContext('2d');
        const config = createChartConfig(manchesterDifData, labels, 'Señal Manchester Diferencial');
        
        // Personalizar la configuración para mostrar solo etiquetas pares
        config.options.scales.x.ticks.callback = function(value, index) {
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
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartWidth').value = 100;
    actualizarTamanoGraficos();
});