export function generarManchesterDiferencial(bits, voltajeInicial) {
    const manchesterDifData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    
    // Controlamos la dirección de la transición (true: bajo-alto, false: alto-bajo)
    let ultimaTransicion = voltajeInicial >= 0;
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            // Para 1: invertimos la dirección de la transición
            ultimaTransicion = !ultimaTransicion;
        }
        // Para ambos casos (0 o 1), generamos la transición correspondiente
        if (ultimaTransicion) {
            // Transición de bajo a alto
            manchesterDifData.push(voltajeBajo);
            manchesterDifData.push(voltajeAlto);
        } else {
            // Transición de alto a bajo
            manchesterDifData.push(voltajeAlto);
            manchesterDifData.push(voltajeBajo);
        }
    }

    return manchesterDifData;
} 