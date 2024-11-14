export const generarManchester = (bits, voltajeAlto, voltajeBajo) => {
    const data = [];
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            // Para 1: transición de positivo a negativo
            data.push(voltajeAlto);
            data.push(voltajeBajo);
        } else {
            // Para 0: transición de negativo a positivo
            data.push(voltajeBajo);
            data.push(voltajeAlto);
        }
    }
    return data;
}; 