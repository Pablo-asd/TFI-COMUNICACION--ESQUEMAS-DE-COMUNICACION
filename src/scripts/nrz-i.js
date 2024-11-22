import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZI } from '../codificadores/cod_nrz_i.js';

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

        // Calcular voltajes automáticamente
        const voltajeAlto = Math.abs(voltajeInicial);
        const voltajeBajo = -Math.abs(voltajeInicial);

        const bitsConExtra = inputBits + '0';
        const nrziData = generarNRZI(bitsConExtra, voltajeAlto, voltajeBajo);
        const labels = [...inputBits.split(''), ''];

        // Destruir gráfico existente si hay uno
        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzIChart').getContext('2d');
        const config = createChartConfig(nrziData, labels, 'Señal NRZ-I');
        
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
    document.getElementById('chartWidth').value = 100;
    // Inicializar tamaños al cargar
    actualizarTamanoGraficos();
});