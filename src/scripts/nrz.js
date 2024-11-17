import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZ } from '../codificadores/cod_nrz.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        const container = document.getElementById('timeChartContainer');
        const canvas = document.getElementById('nrzChart');

        // Actualizar los valores mostrados
        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;

        // Aplicar dimensiones
        container.style.width = `${width}%`;
        container.style.height = `${height}px`;
        
        // Si hay un gráfico existente, actualizarlo
        if (chart) {
            chart.resize();
        }
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

        // Calcular voltajes automáticamente
        const voltajeAlto = Math.abs(voltajeInicial);
        const voltajeBajo = -Math.abs(voltajeInicial);

        const bitsConExtra = inputBits + '0';
        const nrzData = generarNRZ(bitsConExtra, voltajeAlto, voltajeBajo, voltajeInicial);
        const labels = [...inputBits.split(''), ''];

        // Destruir gráfico existente si hay uno
        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzChart').getContext('2d');
        const config = createChartConfig(nrzData, labels, 'Señal NRZ');
        
        // Configurar límites dinámicos
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min - 1;
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1;
        };

        // Crear nuevo gráfico
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

    // Inicializar tamaños al cargar
    actualizarTamanoGraficos();
});
