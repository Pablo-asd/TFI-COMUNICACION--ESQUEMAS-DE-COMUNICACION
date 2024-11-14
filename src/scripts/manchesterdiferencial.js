import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarManchesterDiferencial } from '../codificadores/cod_manchester_diferencial.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeAlto = parseFloat(document.getElementById('voltajePositivo').value);
        const voltajeBajo = parseFloat(document.getElementById('voltajeNegativo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        const manchesterDifData = generarManchesterDiferencial(bitsConExtra, voltajeAlto, voltajeBajo);
        const labels = bitsConExtra.split('').map(bit => [bit, bit]).flat();
        labels[labels.length - 2] = 'x';
        labels[labels.length - 1] = '';

        if (chart) chart.destroy();

        const ctx = document.getElementById('manchesterDifferentialChart').getContext('2d');
        const config = createChartConfig(manchesterDifData, labels, 'Señal Manchester Diferencial');
        
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

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
});