export const generarNRZI = (bits, voltajeAlto, voltajeBajo) => {
    const data = [];
    let nivelActual = voltajeAlto; // Comenzamos con nivel alto

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            // Cambiar nivel
            nivelActual = (nivelActual === voltajeAlto) ? voltajeBajo : voltajeAlto;
        }
        data.push(nivelActual);
    }
    return data;
}; 