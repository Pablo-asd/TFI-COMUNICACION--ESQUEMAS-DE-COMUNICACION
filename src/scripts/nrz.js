import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZ } from '../codificadores/cod_nrz.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);
        
        // Calcular voltajes automáticamente
        const voltajeAlto = Math.abs(voltajeInicial);
        const voltajeBajo = -Math.abs(voltajeInicial);

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        const nrzData = generarNRZ(bitsConExtra, voltajeAlto, voltajeBajo, voltajeInicial);
        const labels = [...inputBits.split(''), 'x'];

        if (chart) chart.destroy();

        const ctx = document.getElementById('nrzChart').getContext('2d');
        const config = createChartConfig(nrzData, labels, 'Señal NRZ');
        
        // Agregar límites dinámicos
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min - 1; // Agregar un poco de margen
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1; // Agregar un poco de margen
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
