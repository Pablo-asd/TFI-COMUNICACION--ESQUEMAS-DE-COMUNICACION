export function generarPolarRZ(bits, voltajeInicial) {
    const polarRZData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            polarRZData.push(voltajeInicial >= 0 ? voltajeAlto : voltajeBajo);
            polarRZData.push(0);
        } else {
            polarRZData.push(voltajeInicial >= 0 ? voltajeBajo : voltajeAlto);
            polarRZData.push(0);
        }
    }

    return polarRZData;
} 