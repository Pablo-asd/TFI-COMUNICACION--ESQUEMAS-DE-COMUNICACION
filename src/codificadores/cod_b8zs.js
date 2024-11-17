export function generarB8ZS(bits, voltajeInicial) {
    const b8zsData = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let ultimaPolaridad = voltajeInicial >= 0 ? voltajeAlto : voltajeBajo;
    let contadorCeros = 0;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            contadorCeros++;
            
            if (contadorCeros === 8) {
                // Eliminar los últimos 5 ceros agregados
                for (let j = 0; j < 5; j++) {
                    b8zsData.pop();
                }
                
                // Secuencia B8ZS: 000VB0VB
                if (ultimaPolaridad === voltajeAlto) {
                    b8zsData.push(0, 0, 0, voltajeBajo, voltajeAlto, 0, voltajeBajo, voltajeAlto);
                    ultimaPolaridad = voltajeAlto;
                } else {
                    b8zsData.push(0, 0, 0, voltajeAlto, voltajeBajo, 0, voltajeAlto, voltajeBajo);
                    ultimaPolaridad = voltajeBajo;
                }
                contadorCeros = 0;
            } else {
                b8zsData.push(0);
            }
        } else { // bit es '1'
            b8zsData.push(ultimaPolaridad);
            ultimaPolaridad = (ultimaPolaridad === voltajeAlto) ? voltajeBajo : voltajeAlto;
            contadorCeros = 0;
        }
    }

    return b8zsData;
} 