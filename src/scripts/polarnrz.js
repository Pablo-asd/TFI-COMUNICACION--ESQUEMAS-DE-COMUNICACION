import { createChartConfig, calcularLimites } from '../utils/chartConfig.js';
import { generarNRZI } from '../codificadores/cod_nrz_i.js';
import { generarNRZL } from '../codificadores/cod_nrz_l.js';

document.addEventListener('DOMContentLoaded', function() {
    let nrzlChart = null;
    let nrziChart = null;

    function actualizarLayoutGraficas() {
        const displayType = document.querySelector('input[name="displayType"]:checked').value;
        const nrzlContainer = document.getElementById('nrzlContainer');
        const nrziContainer = document.getElementById('nrziContainer');
        
        // Primero resetear las clases
        nrzlContainer.className = 'chart-container';
        nrziContainer.className = 'chart-container';
        
        switch(displayType) {
            case 'nrzl':
                nrzlContainer.className = 'chart-container col-12';
                nrziContainer.style.display = 'none';
                nrzlContainer.style.display = 'block';
                break;
            case 'nrzi':
                nrziContainer.className = 'chart-container col-12';
                nrzlContainer.style.display = 'none';
                nrziContainer.style.display = 'block';
                break;
            case 'both':
                nrzlContainer.className = 'chart-container col-12 col-md-6';
                nrziContainer.className = 'chart-container col-12 col-md-6';
                nrzlContainer.style.display = 'block';
                nrziContainer.style.display = 'block';
                break;
        }

        // Forzar actualización de tamaño
        requestAnimationFrame(() => {
            if (nrzlChart) nrzlChart.resize();
            if (nrziChart) nrziChart.resize();
        });
    }

    function actualizarTamanoGraficos() {
        const width = document.getElementById('chartWidth').value;
        const height = document.getElementById('chartHeight').value;
        
        // Actualizar los valores mostrados
        document.getElementById('widthValue').textContent = `${width}%`;
        document.getElementById('heightValue').textContent = `${height}px`;
        
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach(container => {
            container.style.width = `${width}%`;
            container.style.height = `${height}px`;
        });

        // Forzar actualización de tamaño de las gráficas
        requestAnimationFrame(() => {
            if (nrzlChart) nrzlChart.resize();
            if (nrziChart) nrziChart.resize();
        });
    }

    function actualizarGraficos() {
        const inputBits = document.getElementById('inputBits').value.trim();
        const voltajeInicial = parseFloat(document.getElementById('voltajeInicial').value);
        const displayType = document.querySelector('input[name="displayType"]:checked').value;

        if (!/^[01]+$/.test(inputBits)) {
            alert('Por favor, ingrese solo 1s y 0s');
            return;
        }

        const labels = new Array((inputBits.length * 2) + 1).fill('');
        for (let i = 0; i < inputBits.length; i++) {
            labels[i * 2 + 1] = inputBits[i];
        }

        if (nrzlChart) nrzlChart.destroy();
        if (nrziChart) nrziChart.destroy();

        if (displayType === 'nrzl' || displayType === 'both') {
            const nrzlData = generarNRZL(inputBits, voltajeInicial);
            const ctx1 = document.getElementById('polarNRZLChart').getContext('2d');
            const config1 = createChartConfig(nrzlData, labels, 'Señal Polar NRZ-L', voltajeInicial);
            nrzlChart = new Chart(ctx1, config1);
        }

        if (displayType === 'nrzi' || displayType === 'both') {
            const nrziData = generarNRZI(inputBits, voltajeInicial);
            const ctx2 = document.getElementById('polarNRZIChart').getContext('2d');
            const config2 = createChartConfig(nrziData, labels, 'Señal Polar NRZ-I', voltajeInicial);
            nrziChart = new Chart(ctx2, config2);
        }

        // Actualizar layout después de crear las gráficas
        actualizarLayoutGraficas();
    }

    // Event Listeners
    document.getElementById('btnVolver').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    document.getElementById('btnGenerar').addEventListener('click', actualizarGraficos);
    document.getElementById('chartHeight').addEventListener('input', actualizarTamanoGraficos);
    
    // Establecer ancho inicial y actualizar layout
    document.getElementById('chartHeight').value = 400;
    actualizarTamanoGraficos();
    actualizarLayoutGraficas();

    // Modificar el event listener para los radio buttons
    document.querySelectorAll('input[name="displayType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            // Si ya hay datos ingresados, regenerar las gráficas inmediatamente
            const inputBits = document.getElementById('inputBits').value.trim();
            if (inputBits) {
                actualizarGraficos();
            } else {
                actualizarLayoutGraficas();
            }
        });
    });

    // Agregar evento para la tecla Enter
    document.getElementById('inputBits').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            actualizarGraficos();
        }
    });

    // Agregar el event listener para el slider de ancho
    document.getElementById('chartWidth').addEventListener('input', actualizarTamanoGraficos);

    // Establecer valor por defecto del ancho a 100%
    const sliderAncho = document.getElementById('chartWidth');
    sliderAncho.value = 100;
    sliderAncho.setAttribute('value', '100');

    // Actualizar el tamaño inicial
    actualizarTamanoGraficos();
});