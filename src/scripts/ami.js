import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarAMI } from '../codificadores/cod_ami.js';

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
        const amiData = generarAMI(bitsConExtra, voltajePositivo, voltajeNegativo);
        const labels = [...inputBits.split(''), 'x'];

        if (chart) chart.destroy();

        const ctx = document.getElementById('amiChart').getContext('2d');
        const config = createChartConfig(amiData, labels, 'Señal AMI');
        
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