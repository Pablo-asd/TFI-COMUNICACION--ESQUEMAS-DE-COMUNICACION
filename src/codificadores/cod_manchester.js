export function generarManchester(bits, voltajeInicial) {
    const manchesterData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            // Para 0: alto a bajo
            manchesterData.push(voltajeAlto);
            manchesterData.push(voltajeBajo);
        } else {
            // Para 1: bajo a alto
            manchesterData.push(voltajeBajo);
            manchesterData.push(voltajeAlto);
        }
    }
    
    // Agregamos un punto más para mantener el último nivel
    manchesterData.push(manchesterData[manchesterData.length - 1]);

    return manchesterData;
}
