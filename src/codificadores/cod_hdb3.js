/*************  ✨ Codeium Command 🌟  *************/
export function generarHDB3(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = -Math.abs(voltajeInicial);
    const voltajeBajo = Math.abs(voltajeInicial);
    let ultimaPolaridad = voltajeInicial >= 0 ? voltajeAlto : voltajeBajo;
    let contadorCeros = 0;
    let contadorPulsos = 0;

    // Iniciar la señal con el voltaje inicial
     // Punto inicial

    for (let i = 0; i < bits.length; i++) {
        const bit = bits[i];

        if (bit === '1') {
            // Punto en la línea punteada (transición)
            ultimaPolaridad = ultimaPolaridad === voltajeAlto ? voltajeBajo : voltajeAlto;
            data.push(ultimaPolaridad); // Transición
            data.push(ultimaPolaridad);
             // Mantener nivel
            contadorPulsos++;
            contadorCeros = 0;
        } else {
            contadorCeros++;
            
            if (contadorCeros === 4) {
                // Retroceder para sustituir los últimos 4 ceros
                
                data.splice(data.length - 6, 6);
                
                if (contadorPulsos % 2 === 0) {
                    // Patrón B00V (para número par de pulsos)
                    ultimaPolaridad = ultimaPolaridad === voltajeAlto ? voltajeBajo : voltajeAlto;
                    // B
                    data.push(ultimaPolaridad); // Transición
                    data.push(ultimaPolaridad); // Durante el bit
                    // Primer 0
                    data.push(0); // Transición
                    data.push(0); // Durante el bit
                    // Segundo 0
                    data.push(0); // Transición
                    data.push(0); // Durante el bit
                    // V
                    data.push(ultimaPolaridad); // Transición
                    data.push(ultimaPolaridad); // Durante el bit

                } else {
                    // Patrón 000V (para número impar de pulsos)
                    // Tres ceros
                    data.push(0); // Transición primer 0
                    data.push(0); // Durante el bit
                    data.push(0); // Transición segundo 0
                    data.push(0); // Durante el bit
                    data.push(0); // Transición tercer 0
                    data.push(0); // Durante el bit
                    // V
                    let polaridadViolacion = ultimaPolaridad === voltajeAlto ? voltajeAlto : voltajeBajo;
                    data.push(polaridadViolacion); // Transición
                    data.push(polaridadViolacion); // Durante el bit
                    ultimaPolaridad = polaridadViolacion;
                }
                contadorPulsos++;
                contadorCeros = 0;
            } else {
                // Cero normal
                data.push(0); // Transición en línea punteada
                data.push(0); // Durante el bit
            }
        }
    }
    return data;
}

export function generarPuntosGraficos(data) {
    const puntos = [];
    let tiempo = 0;

    for (let i = 0; i < data.length; i++) {
        puntos.push([tiempo, data[i]]);
        tiempo += 0.5; // Medio intervalo para cada punto
    }

    return puntos;
} 