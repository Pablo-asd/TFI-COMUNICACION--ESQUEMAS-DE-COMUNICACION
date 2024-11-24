export function generarNRZL(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);

    // Generamos dos puntos por cada bit para crear los escalones
    for (let i = 0; i < bits.length; i++) {
        const nivel = bits[i] === '0' ? voltajeAlto : voltajeBajo;
        data.push(nivel); // Punto inicial del bit
        data.push(nivel); // Punto final del bit
    }
    
    return data;
} 