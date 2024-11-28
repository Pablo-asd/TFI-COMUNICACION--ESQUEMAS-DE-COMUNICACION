import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZ } from '../codificadores/cod_nrz.js';

document.addEventListener('DOMContentLoaded', function() {
    let chart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        const container = document.getElementById('timeChartContainer');
        const canvas = document.getElementById('nrzChart');

        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;

        container.style.width = `${width}%`;
        container.style.height = `${height}px`;
        
        
        if (chart) {
            chart.resize();
        }
    }

    function actualizarGrafico() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);
        
        if (!inputBits) {
            alert('Por favor, ingrese una secuencia de bits');
            return;
        }

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

       
        const voltajeAlto = Math.abs(voltajeInicial);
        const voltajeBajo = 0;
        
        const nrzData = generarDatosNRZ(inputBits, voltajeAlto, voltajeBajo);
        
        const labels = new Array((inputBits.length * 2) + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i *2 + 1] = inputBits[i];  
        }

        // Destruir gráfico existente si hay uno
        if (chart) {
            chart.destroy();
        }

        const ctx = document.getElementById('nrzChart').getContext('2d');
        const config = createChartConfig(nrzData, labels, 'Señal NRZ', voltajeInicial);
        
        // Configurar límites dinámicos
        config.options.scales.x.min = 0; // Ajustar el límite mínimo del eje X
        config.options.scales.x.max = inputBits.length * 2; // Ajustar el límite máximo del eje X
        config.options.scales.x.ticks.callback = function(value, index) {
            return labels[index] || '';
        };
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min; // Ajustar el límite inferior del eje Y
        };
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1; // Ajustar el límite superior del eje Y
        };

        
        chart = new Chart(ctx, config);
    }

    
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGrafico);
    
    
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);

    document.getElementById('chartWidth').value = 100;
    
    actualizarTamanoGraficos();
});

function generarDatosNRZ(bits, voltajeAlto, voltajeBajo) {
    const data = [];
    let currentVoltage = voltajeAlto; 
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            data.push(voltajeAlto);
            data.push(voltajeAlto);
        } else {
            data.push(voltajeBajo);
            data.push(voltajeBajo);
        }
        
    }

    return data;
}