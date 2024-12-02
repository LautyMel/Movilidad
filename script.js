// Definición de precios de boletos por mes, inicializada con valores predeterminados
let precios = {
    "julio": [270, 280, 290],
    "agosto": [371.13, 413.44, 445.29, 477.17, 508.83],
    "septiembre": [371.13, 380, 390]
};

// Presupuesto inicial
let presupuesto = 8000;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcularGastoMensual(precios, presupuesto) {
    let gastoMensual = {};
    let totalGasto = 0;

    for (let mes in precios) {
        let gastosMes = [];
        for (let precio of precios[mes]) {
            let viajes = randomInt(1, 7); // Número aleatorio de viajes (entre 1 y 7)
            let gasto = viajes * precio;

            if (totalGasto + gasto <= presupuesto) {
                gastosMes.push({ viajes, precio, gasto });
                totalGasto += gasto;
            }
        }
        gastoMensual[mes] = gastosMes;
    }

    return { gastoMensual, totalGasto };
}

function ajustarSobrante(precios, gastoMensual, totalGasto, presupuesto) {
    let sobrante = presupuesto - totalGasto;
    let maxIteraciones = 100;

    while (sobrante > 5 && maxIteraciones > 0) {
        for (let mes in gastoMensual) {
            let preciosDisponibles = precios[mes].filter(precio => !gastoMensual[mes].some(g => g.precio === precio));
            preciosDisponibles.sort((a, b) => a - b);

            for (let precio of preciosDisponibles) {
                if (precio <= sobrante) {
                    gastoMensual[mes].push({ viajes: 1, precio, gasto: precio });
                    totalGasto += precio;
                    sobrante -= precio;
                    break;
                }
            }
            if (sobrante <= 5) {
                sobrante = Math.max(sobrante, 0);
                break;
            }
        }
        maxIteraciones--;
    }

    sobrante = Math.max(sobrante, 0); // Asegurarse de que el sobrante no sea negativo

    return { totalGasto, sobrante };
}

// Función para actualizar el presupuesto desde el input
function actualizarPresupuesto() {
    const nuevoPresupuesto = parseFloat(document.getElementById("presupuestoInput").value);
    if (!isNaN(nuevoPresupuesto) && nuevoPresupuesto >= 0) {
        presupuesto = nuevoPresupuesto;
        alert(`Presupuesto actualizado a $${presupuesto}`);
    } else {
        alert("Por favor, ingrese un valor válido para el presupuesto.");
    }
}

// Función para actualizar los precios desde el input
function actualizarPrecios() {
    const preciosInput = document.getElementById("preciosInput").value;
    const preciosArray = preciosInput.split(',').map(valor => parseFloat(valor.trim()));
    
    // Asumiendo que los precios proporcionados son para julio, agosto y septiembre
    if (preciosArray.length >= 3) {
        precios["julio"] = preciosArray.slice(0, 3);
        precios["agosto"] = preciosArray.slice(3, 8);
        precios["septiembre"] = preciosArray.slice(8);
        alert("Precios actualizados correctamente.");
    } else {
        alert("Por favor, ingrese al menos tres precios para cada mes.");
    }
}

function calcular() {
    // Llamamos a la función para actualizar precios antes de calcular
    actualizarPrecios();

    let { gastoMensual, totalGasto } = calcularGastoMensual(precios, presupuesto);
    let { totalGasto: totalGastoFinal, sobrante } = ajustarSobrante(precios, gastoMensual, totalGasto, presupuesto);

    let resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    let resultadosHTML = '<h2>Resultados de Cálculo:</h2>';
    
    for (let mes in gastoMensual) {
        resultadosHTML += `<h3>Para ${mes.charAt(0).toUpperCase() + mes.slice(1)}:</h3>`;
        for (let gasto of gastoMensual[mes]) {
            resultadosHTML += `<p>${gasto.viajes} x ${gasto.precio} = ${gasto.gasto.toFixed(2)}</p>`;
        }
    }

    resultadosHTML += `<h3>Total Gastado: $${totalGastoFinal.toFixed(2)}</h3>`;
    resultadosHTML += `<h3>Sobrante: $${sobrante.toFixed(2)}</h3>`;

    resultadosDiv.innerHTML = resultadosHTML;
}
