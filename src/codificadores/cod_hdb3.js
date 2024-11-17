export function generarHDB3(bits, voltajeInicial) {
    const hdb3Data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    let ultimaPolaridad = voltajeInicial >= 0 ? voltajeAlto : voltajeBajo;
    let contadorCeros = 0;
    let contadorPulsos = 0;

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '0') {
            contadorCeros++;
            
            if (contadorCeros === 4) {
                // Eliminar los últimos 3 ceros agregados
                for (let j = 0; j < 3; j++) {
                    hdb3Data.pop();
                }
                
                // Aplicar regla HDB3
                if (contadorPulsos % 2 === 0) {
                    // B00V: Violación con la misma polaridad que el último pulso
                    hdb3Data.push(ultimaPolaridad, 0, 0, ultimaPolaridad);
                } else {
                    // 000V: Violación con polaridad opuesta
                    let polaridadViolacion = (ultimaPolaridad === voltajeAlto) ? voltajeBajo : voltajeAlto;
                    hdb3Data.push(0, 0, 0, polaridadViolacion);
                    ultimaPolaridad = polaridadViolacion;
                }
                contadorPulsos++;
                contadorCeros = 0;
            } else {
                hdb3Data.push(0);
            }
        } else { // bit es '1'
            hdb3Data.push(ultimaPolaridad);
            ultimaPolaridad = (ultimaPolaridad === voltajeAlto) ? voltajeBajo : voltajeAlto;
            contadorPulsos++;
            contadorCeros = 0;
        }
    }

    return hdb3Data;
} 