
        // Función para parsear los precios ingresados por el usuario
        function parsearPrecios() {
            const precios = {};
            for (let i = 1; i <= 3; i++) {
                const mesSeleccionado = document.getElementById(`mes-${i}`).value;
                const preciosMes = document.getElementById(`precios-${i}`).value;
                precios[mesSeleccionado] = preciosMes.split(',').map(Number);
            }
            return precios;
        }

        // Función para calcular el gasto mensual
        function calcularGastoMensual(presupuesto, precios) {
            let gastoMensual = {};
            let totalGasto = 0;
            let detalles = "";

            for (let mes in precios) {
                let gastosMes = [];
                for (let precio of precios[mes]) {
                    let viajes = Math.floor(Math.random() * 7) + 1; // 1 a 7 viajes aleatorios
                    let gasto = (viajes * precio).toFixed(2);
                    if (totalGasto + parseFloat(gasto) <= presupuesto) {
                        gastosMes.push({ viajes, precio, gasto });
                        totalGasto += parseFloat(gasto);
                    }
                }
                gastoMensual[mes] = gastosMes;
            }

            // Mostrar los detalles de cada mes
            for (let mes in gastoMensual) {
                detalles += `<h3>${mes.charAt(0).toUpperCase() + mes.slice(1)}</h3><ul>`;
                for (let gasto of gastoMensual[mes]) {
                    detalles += `<li>Para ${mes.charAt(0).toUpperCase() + mes.slice(1)}: ${gasto.viajes} x $${gasto.precio.toFixed(2)} = $${gasto.gasto}</li>`;
                }
                detalles += `</ul>`;
            }

            return { gastoMensual, totalGasto, detalles };
        }

        // Función para ajustar el sobrante
        function ajustarSobrante(presupuesto, gastoMensual, totalGasto, precios) {
            let sobrante = parseFloat((presupuesto - totalGasto).toFixed(2)); // Asegurarse de que sobrante sea un número
            let maxIteraciones = 100;
            let detalles = "";

            // Asegurarse de que el sobrante sea lo más pequeño posible (menor a 5)
            while (sobrante >= 5 && maxIteraciones > 0) {
                for (let mes in gastoMensual) {
                    let preciosDisponibles = precios[mes].filter(precio => !gastoMensual[mes].some(gasto => gasto.precio === precio));
                    preciosDisponibles.sort();

                    // Intentar agregar precios solo si es posible
                    for (let precio of preciosDisponibles) {
                        let gasto = parseFloat(precio.toFixed(2));
                        if (gasto <= sobrante) {
                            gastoMensual[mes].push({ viajes: 1, precio, gasto });
                            totalGasto += gasto;
                            sobrante = parseFloat((sobrante - gasto).toFixed(2));
                            detalles += `<p>Añadiendo 1 x $${precio.toFixed(2)} = $${gasto} a ${mes.charAt(0).toUpperCase() + mes.slice(1)}, nuevo sobrante: $${sobrante.toFixed(2)}</p>`;
                            break;
                        }
                    }
                    if (sobrante < 5) break; // Detener si sobrante es menor que 5
                }
                maxIteraciones--;
            }

            return { totalGasto, sobrante, detalles };
        }

        // Función para calcular los resultados
        function calcular() {
            let presupuesto = parseFloat(document.getElementById("presupuesto").value);
            const precios = parsearPrecios();

            // Asegurarnos que el presupuesto es válido
            if (isNaN(presupuesto) || presupuesto <= 0) {
                alert("Por favor, ingrese un presupuesto válido.");
                return;
            }

            // Calcular gasto mensual
            let { gastoMensual, totalGasto, detalles } = calcularGastoMensual(presupuesto, precios);

            // Ajustar sobrante
            let { totalGasto: totalFinal, sobrante, detallesSobrante } = ajustarSobrante(presupuesto, gastoMensual, totalGasto, precios);

            // Mostrar los resultados en la página
            document.getElementById("detalles").innerHTML = detalles + detallesSobrante;
            document.getElementById("total-gasto").textContent = totalFinal.toFixed(2);
            document.getElementById("sobrante").textContent = sobrante.toFixed(2);

            document.getElementById("resultados").style.display = "block";
        }
