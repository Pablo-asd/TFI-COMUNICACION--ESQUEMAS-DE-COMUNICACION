export function generarNRZI(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let nivelActual = voltajeAlto;

    // Para cada bit, generamos dos puntos
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            // Si es 1, cambiamos el nivel al inicio del período
            nivelActual = (nivelActual === voltajeAlto) ? voltajeBajo : voltajeAlto;
        }
        // Agregamos dos puntos con el nivel actual (ya sea que haya cambiado o no)
        data.push(nivelActual);
        data.push(nivelActual);
    }
    
    return data;
} 