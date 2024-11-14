import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarHDB3 } from '../codificadores/cod_hdb3.js';

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
        const hdb3Data = generarHDB3(bitsConExtra, voltajePositivo, voltajeNegativo);
        const labels = [...inputBits.split(''), 'x'];

        if (chart) chart.destroy();

        const ctx = document.getElementById('hdb3Chart').getContext('2d');
        const config = createChartConfig(hdb3Data, labels, 'Señal HDB3');
        
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