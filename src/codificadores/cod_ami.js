export const generarAMI = (bits, voltajePositivo, voltajeNegativo) => {
    const data = [];
    let ultimoPulsoPositivo = true;
    
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            if (ultimoPulsoPositivo) {
                data.push(voltajeNegativo);
                ultimoPulsoPositivo = false;
            } else {
                data.push(voltajePositivo);
                ultimoPulsoPositivo = true;
            }
        } else {
            data.push(0);
        }
    }
    return data;
}; 