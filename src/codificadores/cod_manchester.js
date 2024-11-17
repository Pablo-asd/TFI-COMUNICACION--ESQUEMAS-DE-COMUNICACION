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