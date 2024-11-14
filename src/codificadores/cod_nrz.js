export const generarNRZ = (bits, voltajeAlto, voltajeBajo) => {
    const data = [];
    for (let i = 0; i < bits.length; i++) {
        data.push(bits[i] === '1' ? voltajeAlto : voltajeBajo);
    }
    return data;
}; 