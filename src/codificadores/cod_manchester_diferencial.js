export const generarManchesterDiferencial = (bits, voltajeAlto, voltajeBajo) => {
    const data = [];
    let transicionPrevia = true; // true para transición ascendente, false para descendente
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            // Para 0, mantener la misma transición que el bit anterior
            if (transicionPrevia) {
                data.push(voltajeBajo);
                data.push(voltajeAlto);
            } else {
                data.push(voltajeAlto);
                data.push(voltajeBajo);
            }
        } else {
            // Para 1, invertir la transición
            if (transicionPrevia) {
                data.push(voltajeAlto);
                data.push(voltajeBajo);
                transicionPrevia = false;
            } else {
                data.push(voltajeBajo);
                data.push(voltajeAlto);
                transicionPrevia = true;
            }
        }
    }
    return data;
}; 