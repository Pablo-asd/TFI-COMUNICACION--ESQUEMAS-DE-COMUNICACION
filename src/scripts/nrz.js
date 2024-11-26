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
        const abels = new Array((inputBits.length * 2) + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            abels[i] = inputBits[i];
        }

        // Calcular voltajes automáticamente
        const voltajeAlto = Math.abs(voltajeInicial);
        const voltajeBajo = 0

        const bitsConExtra = inputBits + '0';
        const nrzData = generarNRZ(bitsConExtra, voltajeAlto, voltajeBajo, voltajeInicial);
        const labels = [...inputBits.split(''), ''];

        // Destruir gráfico existente si hay uno
        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzChart').getContext('2d');
        const config = createChartConfig(nrzData, labels, 'Señal NRZ', voltajeInicial);
        
        // Configurar límites dinámicos
        config.options.scales.x.ticks.callback = function(context, index) {
            return abels[index] || '';
        };
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min +0;
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
