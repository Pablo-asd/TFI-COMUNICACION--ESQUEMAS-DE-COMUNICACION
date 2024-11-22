import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarManchester } from '../codificadores/cod_manchester.js';
import { generarManchesterDiferencial } from '../codificadores/cod_manchester_diferencial.js';

document.addEventListener('DOMContentLoaded', function() {
    let manchesterChart = null;
    let differentialChart = null;

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        
        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;
        
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach(container => {
            container.style.width = `${width}%`;
            container.style.height = `${height}px`;
        });

        if (manchesterChart) manchesterChart.resize();
        if (differentialChart) differentialChart.resize();
    }

    function actualizarLayoutGraficas() {
        const displayType = document.querySelector('input[name="displayType"]:checked').value;
        const manchesterContainer = document.getElementById('manchesterContainer');
        const differentialContainer = document.getElementById('differentialContainer');

        switch(displayType) {
            case 'manchester':
                manchesterContainer.className = 'col-12';
                differentialContainer.className = 'col-12 d-none';
                break;
            case 'differential':
                manchesterContainer.className = 'col-12 d-none';
                differentialContainer.className = 'col-12';
                break;
            case 'both':
                manchesterContainer.className = 'col-12 col-md-6';
                differentialContainer.className = 'col-12 col-md-6';
                break;
        }

        actualizarTamanoGraficos();
    }

    function configurarGrafica(config, labels) {
        config.options.scales.x.ticks.callback = function(value, index) {
            return index % 2 === 0 && index < labels.length - 2 ? this.getLabelForValue(value) : '';
        };
        
        config.options.scales.y.min = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.min - 1;
        };
        
        config.options.scales.y.max = function(context) {
            const limites = calcularLimites(context.chart.data.datasets[0].data);
            return limites.max + 1;
        };
    }

    function actualizarGraficos() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);
        const displayType = document.querySelector('input[name="displayType"]:checked').value;

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const bitsConExtra = inputBits + '0';
        const labels = crearLabels(bitsConExtra);
        
        // Destruir gráficos existentes
        if (manchesterChart) manchesterChart.destroy();
        if (differentialChart) differentialChart.destroy();

        // Generar y procesar datos según sea necesario
        if (displayType === 'manchester' || displayType === 'both') {
            let manchesterData = generarManchester(bitsConExtra, voltajeInicial);
            manchesterData = procesarDatos(manchesterData);
            const ctx1 = document.getElementById('manchesterChart').getContext('2d');
            const config1 = createChartConfig(manchesterData, labels, 'Señal Manchester');
            configurarGrafica(config1, labels);
            manchesterChart = new Chart(ctx1, config1);
        }

        if (displayType === 'differential' || displayType === 'both') {
            let manchesterDifData = generarManchesterDiferencial(bitsConExtra, voltajeInicial);
            manchesterDifData = procesarDatos(manchesterDifData);
            const ctx2 = document.getElementById('manchesterDifferentialChart').getContext('2d');
            const config2 = createChartConfig(manchesterDifData, labels, 'Señal Manchester Diferencial');
            configurarGrafica(config2, labels);
            differentialChart = new Chart(ctx2, config2);
        }

        actualizarLayoutGraficas();
    }

    function procesarDatos(data) {
        const longitudSegmento = 2;
        const ultimoIndice = data.length - longitudSegmento + Math.floor(longitudSegmento/4);
        data = data.slice(0, ultimoIndice);
        
        if (data.length > 0) {
            data[data.length - 1] = 0;
        }
        return data;
    }

    function crearLabels(bits) {
        const labels = bits.split('').map(bit => [bit, bit]).flat();
        labels[labels.length - 2] = '';
        labels[labels.length - 1] = '';
        return labels;
    }

    // Event Listeners
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGraficos);
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    document.querySelectorAll('input[name="displayType"]').forEach(radio => {
        radio.addEventListener('change', actualizarGraficos);
    });

    actualizarTamanoGraficos();
});