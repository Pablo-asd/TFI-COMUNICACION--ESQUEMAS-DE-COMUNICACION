export function generarHDB3(bits, voltajeInicial) {
    const data = [];
    const voltajeAlto = Math.abs(voltajeInicial);
    const voltajeBajo = -Math.abs(voltajeInicial);
    
    let ultimaPolaridad = voltajeInicial >= 0 ? voltajeBajo : voltajeAlto;
    let contadorCeros = 0;
    let contadorPulsos = 0;
    let ultimoPatronFueB00V = false; // Para alternar entre patrones

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === '1') {
            ultimaPolaridad = -ultimaPolaridad;
            agregarPulso(data, ultimaPolaridad);
            contadorPulsos++;
            contadorCeros = 0;
        } else {
            contadorCeros++;
            
            if (contadorCeros === 4) {
                // Eliminar los últimos tres ceros (6 puntos) que ya se agregaron
                data.splice(data.length - 6, 6);
                
                // Alternar entre patrones para una mejor distribución de señal
                if (!ultimoPatronFueB00V) {
                    // Usar patrón B00V
                    let polaridadBV;
                    
                    if (contadorPulsos % 2 === 0) {
                        // Contador par
                        if (ultimaPolaridad > 0) {
                            polaridadBV = voltajeBajo;  // B y V negativos
                        } else {
                            polaridadBV = voltajeAlto;  // B y V positivos
                        }
                    } else {
                        // Contador impar
                        if (ultimaPolaridad > 0) {
                            polaridadBV = voltajeBajo;  // B y V negativos
                        } else {
                            polaridadBV = voltajeAlto;  // B y V positivos
                        }
                    }
                    
                    agregarPulso(data, polaridadBV);     // B
                    agregarPulso(data, 0);               // 0
                    agregarPulso(data, 0);               // 0
                    agregarPulso(data, polaridadBV);     // V
                    ultimaPolaridad = polaridadBV;
                    ultimoPatronFueB00V = true;
                } else {
                    // Usar patrón 000V
                    let polaridadV;
                    
                    if (contadorPulsos % 2 === 0) {
                        // Contador par
                        if (ultimaPolaridad > 0) {
                            polaridadV = voltajeAlto;  // V positivo
                        } else {
                            polaridadV = voltajeBajo;  // V negativo
                        }
                    } else {
                        // Contador impar
                        if (ultimaPolaridad > 0) {
                            polaridadV = voltajeAlto;  // V positivo
                        } else {
                            polaridadV = voltajeBajo;  // V negativo
                        }
                    }
                    
                    agregarPulso(data, 0);              // 0
                    agregarPulso(data, 0);              // 0
                    agregarPulso(data, 0);              // 0
                    agregarPulso(data, polaridadV);     // V
                    ultimaPolaridad = polaridadV;
                    ultimoPatronFueB00V = false;
                }
                
                contadorPulsos++;  // La violación cuenta como un pulso
                contadorCeros = 0;
            } else {
                agregarPulso(data, 0);
            }
        }
    }
    
    return data;
}

function agregarPulso(data, valor) {
    // Cada pulso consiste en dos puntos para mantener el nivel durante el período
    data.push(valor);
    data.push(valor);
}

export function generarPuntosGraficos(data) {
    const puntos = [];
    let tiempo = 0;
    const intervalo = 0.5;

    for (let i = 0; i < data.length; i++) {
        puntos.push([tiempo, data[i]]);
        tiempo += intervalo;
    }

    return puntos;
}