export function generarManchester(bits, voltajeInicial) {
    const manchesterData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            manchesterData.push(voltajeInicial >= 0 ? voltajeBajo : voltajeAlto);
            manchesterData.push(voltajeInicial >= 0 ? voltajeAlto : voltajeBajo);
        } else {
            manchesterData.push(voltajeInicial >= 0 ? voltajeAlto : voltajeBajo);
            manchesterData.push(voltajeInicial >= 0 ? voltajeBajo : voltajeAlto);
        }
    }

    return manchesterData;
}

export function generarManchesterDiferencial(bits, voltajeInicial) {
    const manchesterDifData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let nivelActual = voltajeInicial >= 0 ? voltajeAlto : voltajeBajo;
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            // Para 1: invertimos el nivel
            nivelActual = (nivelActual === voltajeAlto) ? voltajeBajo : voltajeAlto;
        }
        // Para 0 mantenemos el mismo nivel
        
        manchesterDifData.push(nivelActual);
        manchesterDifData.push(nivelActual === voltajeAlto ? voltajeBajo : voltajeAlto);
    }

    return manchesterDifData;
}
