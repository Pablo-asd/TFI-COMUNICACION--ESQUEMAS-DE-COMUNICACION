export const generarHDB3 = (bits, voltajePositivo, voltajeNegativo) => {
    const data = [];
    let contadorCeros = 0;
    let ultimoPulsoPositivo = true;
    let ultimaViolacionPositiva = true;
    let contadorUnos = 0;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            contadorCeros++;
            if (contadorCeros === 4) {
                // Insertar violación B00V
                data[data.length - 3] = 0;
                data[data.length - 2] = 0;
                data[data.length - 1] = 0;
                
                if (contadorUnos % 2 === 0) {
                    // Necesitamos B00V
                    data.push(ultimaViolacionPositiva ? voltajeNegativo : voltajePositivo);
                    data[data.length - 4] = ultimaViolacionPositiva ? voltajeNegativo : voltajePositivo;
                    ultimaViolacionPositiva = !ultimaViolacionPositiva;
                } else {
                    // Solo necesitamos 000V
                    data.push(ultimoPulsoPositivo ? voltajePositivo : voltajeNegativo);
                    ultimoPulsoPositivo = !ultimoPulsoPositivo;
                }
                contadorCeros = 0;
            } else {
                data.push(0);
            }
        } else { // bit es '1'
            contadorCeros = 0;
            contadorUnos++;
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