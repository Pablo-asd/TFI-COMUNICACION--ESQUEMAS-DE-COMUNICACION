export function generarManchesterDiferencial(bits, voltajeInicial) {
    const manchesterDifData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let ultimaTransicion = voltajeInicial >= 0; // true para transición positiva, false para negativa
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            // Para 1: invertir la última transición
            ultimaTransicion = !ultimaTransicion;
        }
        // Para ambos casos, generar la transición
        if (ultimaTransicion) {
            manchesterDifData.push(voltajeBajo);
            manchesterDifData.push(voltajeAlto);
        } else {
            manchesterDifData.push(voltajeAlto);
            manchesterDifData.push(voltajeBajo);
        }
    }

    return manchesterDifData;
} 