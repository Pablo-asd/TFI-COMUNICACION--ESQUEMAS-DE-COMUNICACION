import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarB8ZS } from '../codificadores/cod_b8zs.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajePositivo = parseFloat(document.getElementById('voltajePositivo').value);
        const voltajeNegativo = parseFloat(document.getElementById('voltajeNegativo').value);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        const b8zsData = generarB8ZS(bitsConExtra, voltajePositivo, voltajeNegativo);
        const labels = [...inputBits.split(''), 'x'];

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

    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
});