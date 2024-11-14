export const generarPolarRZ = (bits, voltajeAlto, voltajeBajo) => {
    const data = [];
    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            data.push(voltajeAlto);
            data.push(0);
        } else {
            data.push(voltajeBajo);
            data.push(0);
        }
    }
    return data;
}; 