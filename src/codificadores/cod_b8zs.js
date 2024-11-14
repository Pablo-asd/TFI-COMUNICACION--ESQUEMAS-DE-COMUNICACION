export const generarB8ZS = (bits, voltajePositivo, voltajeNegativo) => {
    const data = [];
    let contadorCeros = 0;
    let ultimoPulsoPositivo = true;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            contadorCeros++;
            if (contadorCeros === 8) {
                // Reemplazar los últimos 8 ceros con la secuencia B8ZS
                data[data.length - 7] = 0;
                data[data.length - 6] = 0;
                data[data.length - 5] = 0;
                
                if (ultimoPulsoPositivo) {
                    // 000+-0-+
                    data[data.length - 4] = voltajePositivo;
                    data[data.length - 3] = voltajeNegativo;
                    data[data.length - 2] = 0;
                    data[data.length - 1] = voltajeNegativo;
                    data.push(voltajePositivo);
                } else {
                    // 000-+0+-
                    data[data.length - 4] = voltajeNegativo;
                    data[data.length - 3] = voltajePositivo;
                    data[data.length - 2] = 0;
                    data[data.length - 1] = voltajePositivo;
                    data.push(voltajeNegativo);
                }
                contadorCeros = 0;
            } else {
                data.push(0);
            }
        } else { // bit es '1'
            contadorCeros = 0;
            if (ultimoPulsoPositivo) {
                data.push(voltajeNegativo);
                ultimoPulsoPositivo = false;
            } else {
                data.push(voltajePositivo);
                ultimoPulsoPositivo = true;
            }
        }
    }
    return data;
}; 