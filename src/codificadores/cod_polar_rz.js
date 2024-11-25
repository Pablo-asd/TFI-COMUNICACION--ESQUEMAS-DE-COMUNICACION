export function generarPolarRZ(bits, voltajeInicial) {
    const data = [];
    const voltajePositivo = voltajeInicial;
    const voltajeNegativo = -voltajeInicial;
    const voltajeCero = 0;

    for (let i = 0; i < bits.length; i++) {
        const bitActual = bits[i];

        if (bitActual === '1') {
            // Primera mitad del intervalo para '1': voltaje positivo
            data.push(voltajePositivo);
            // Segunda mitad del intervalo para '1': vuelve a cero
            data.push(voltajeCero);
        } else if (bitActual === '0') {
            // Primera mitad del intervalo para '0': voltaje negativo
            data.push(voltajeNegativo);
            // Segunda mitad del intervalo para '0': vuelve a cero
            data.push(voltajeCero);
        }
    }
    data.push(voltajeCero);
    return data;
}
