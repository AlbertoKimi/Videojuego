// =====================
// VARIABLES GLOBALES
// =====================
let mazo = [];
let mazoBarajado = [];
let columna = [];
let primerClick = null;

const TIPOS = ["Co", "Di", "Tr", "Pi"];
const COLORES = { Co: "rojo", Di: "rojo", Tr: "negro", Pi: "negro" };

// =====================
// ELEMENTOS DEL DOM
// =====================
const botonEmpezar = document.querySelector(".adelante");
const inicial = document.querySelector("#posicion_inicial");
const mazoBaraja = document.querySelector("#mazo-baraja");

// =====================
// FUNCIONES PRINCIPALES
// =====================

// Crea el mazo de cartas
const crearMazo = () => {
    mazo = [];
    for (let i = 1; i <= 13; i++) {
        TIPOS.forEach(tipo => {
            mazo.push({
                numero: i,
                color: COLORES[tipo],
                tipo,
                img: `${i}${tipo}.png`,
                estaVolteada: true
            });
        });
    }
};

// Baraja el mazo
const barajarMazo = () => {
    mazoBarajado = mazo
        .map(carta => ({ carta, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ carta }) => carta);
};

// Reparte las cartas en las columnas del tablero
const darCartas = () => {
    columna = Array.from({ length: 7 }, () => []);
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            columna[i].push(mazoBarajado.shift());
        }
    }
};

// Crea un elemento HTML para una carta
const crearCartaHTML = (carta) => {
    const cartaHTML = document.createElement("div");
    const foto = document.createElement("img");

    foto.src = carta.estaVolteada ? "Imagenes/Dorso.webp" : `Imagenes/Baraja/${carta.img}`;

    cartaHTML.dataset.numero = carta.numero;
    cartaHTML.dataset.color = carta.color;
    cartaHTML.dataset.tipo = carta.tipo;
    cartaHTML.classList.add("carta");
    cartaHTML.appendChild(foto);
    cartaHTML.onclick = () => comprobarClick(cartaHTML);

    return cartaHTML;
};

// Crea una carta "fantasma" cuando la columna está vacía
const crearCartaFantasma = (columnaIndex) => {
    const cartaFantasma = document.createElement("div");
    cartaFantasma.classList.add("carta");
    cartaFantasma.dataset.fantasma = true;
    cartaFantasma.dataset.pila = columnaIndex;
    cartaFantasma.style.width = '100px';
    cartaFantasma.style.height = '140px';
    cartaFantasma.style.backgroundColor = 'transparent';
    cartaFantasma.onclick = () => comprobarClick(cartaFantasma);

    return cartaFantasma;
};

//Coloca las cartas en el inicio
/*const ponerCartasInicio = () => {

    for (let i = 0; i < mazoBarajado.length; i++) {
        const carta = mazoBarajado[i];
        const cartaHTML = crearCartaHTML(carta);
        inicial.appendChild(cartaHTML);
    }
}*/

// Coloca las cartas en las columnas del tablero
/*const ponerCartasColumna = () => {
    for (let i = 0; i < columna.length; i++) {
        const pila = document.querySelector(`#pila-${i}`);
        if (!pila) {
            console.error(`No se encontró el elemento #pila-${i}`);
            continue;
        }

        pila.innerHTML = "";

        if (columna[i].length === 0) {
            pila.appendChild(crearCartaFantasma(i));
        } else {
            columna[i].forEach((carta, j) => {
                if (j === columna[i].length - 1) carta.estaVolteada = false;
                const cartaHTML = crearCartaHTML(carta);
                cartaHTML.dataset.pila = i;
                cartaHTML.style.top = `${j * 33}px`;
                pila.appendChild(cartaHTML);
            });
        }
    }
};*/

// Coloca las cartas en las columnas del tablero
const ponerCartasColumna = () => {
    for (let i = 0; i < columna.length; i++) {
        const pila = document.querySelector(`#pila-${i}`);
        if (!pila) {
            console.error(`No se encontró el elemento #pila-${i}`);
            continue;
        }

        pila.innerHTML = ""; // Limpiar la pila antes de colocar las cartas

        // Si la columna está vacía, mostrar una carta fantasma (en el caso de las pilas vacías)
        if (columna[i].length === 0) {
            pila.appendChild(crearCartaFantasma(i));
        } else {
            columna[i].forEach((carta, j) => {
                // Si es la última carta, la volteamos
                if (j === columna[i].length - 1) carta.estaVolteada = false;

                // Crear el HTML de la carta
                const cartaHTML = crearCartaHTML(carta);
                cartaHTML.dataset.pila = i; // Asignamos la pila a la carta
                cartaHTML.style.position = "absolute"; // Asegurarnos de que la carta esté posicionada absolutamente

                // Ajustar el desplazamiento vertical basado en la posición en la pila
                cartaHTML.style.top = `${j * 33}px`; // Desplazamiento vertical de las cartas apiladas
                cartaHTML.style.left = "0"; // Alineación horizontal
                pila.appendChild(cartaHTML);
            });
        }
    }
};


// =====================
// LÓGICA DE MOVIMIENTO
// =====================
/*const comprobarClick = (carta) => {
    console.log("Carta clickeada:", carta.dataset);

    if (!primerClick) {
        // PRIMER CLICK - SELECCIÓN
        const pilaCartaSeleccionada = columna[Number(carta.dataset.pila)];
        const indiceCartaSeleccionada = pilaCartaSeleccionada.findIndex(
            c => c.numero === Number(carta.dataset.numero) && c.color === carta.dataset.color // Aquí convertimos carta.dataset.numero a un número
        );

        console.log("Intentando seleccionar carta en pila:", pilaCartaSeleccionada);
        console.log("Índice de la carta seleccionada:", indiceCartaSeleccionada);

        // Verificar si la carta está volteada
        if (indiceCartaSeleccionada === -1 || pilaCartaSeleccionada[indiceCartaSeleccionada].estaVolteada) {
            console.warn("Intentaste seleccionar una carta volteada o inexistente.");
            alert("No puedes seleccionar una carta volteada");
            return;
        }

        primerClick = carta;
        carta.style.border = "2px solid red";
        console.log("Carta seleccionada correctamente:", primerClick.dataset);
    } else {
        // SEGUNDO CLICK - MOVIMIENTO
        const segundoClick = carta;
        const pilaPrimeraCarta = columna[Number(primerClick.dataset.pila)];
        const pilaSegundaCarta = columna[Number(segundoClick.dataset.pila)];

        console.log("Primer click (origen):", primerClick.dataset);
        console.log("Segundo click (destino):", segundoClick.dataset);
        console.log("Pila origen antes de mover:", pilaPrimeraCarta);
        console.log("Pila destino antes de mover:", pilaSegundaCarta);

        // Obtener el índice real de la carta en la pila
        const indiceCartaSeleccionada = pilaPrimeraCarta.findIndex(
            c => c.numero === Number(primerClick.dataset.numero) && c.color === primerClick.dataset.color // Aquí también convertimos a número
        );

        console.log("Índice de la carta seleccionada en la pila:", indiceCartaSeleccionada);

        // Validar si la carta se puede mover sobre otra carta
        if (
            indiceCartaSeleccionada !== -1 &&
            Number(primerClick.dataset.numero) === Number(segundoClick.dataset.numero) - 1 &&
            segundoClick.dataset.color !== primerClick.dataset.color
        ) {
            // Mover todas las cartas desde la seleccionada hasta la última
            const cartasAMover = pilaPrimeraCarta.splice(indiceCartaSeleccionada);
            console.log("Cartas a mover:", cartasAMover);

            pilaSegundaCarta.push(...cartasAMover);

            // Voltear la nueva última carta de la columna de origen, si existe
            if (pilaPrimeraCarta.length > 0) {
                pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
                console.log("Volteando la nueva última carta en la pila de origen:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
            }

            ponerCartasColumna();
        }
        // Movimiento especial: Rey a una columna vacía
        else if (Number(primerClick.dataset.numero) === 13 && segundoClick.dataset.fantasma !== undefined) {
            console.log("Moviendo Rey a una columna vacía.");
            const cartasAMover = pilaPrimeraCarta.splice(indiceCartaSeleccionada);
            pilaSegundaCarta.push(...cartasAMover);

            if (pilaPrimeraCarta.length > 0) {
                pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
                console.log("Volteando la nueva última carta después de mover el Rey:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
            }

            ponerCartasColumna();
        }
        else {
            console.warn("Movimiento no permitido. No cumple las reglas.");
            alert("No se puede realizar el movimiento");
        }

        resetearSeleccion();
    }
};*/

const comprobarClick = (carta) => {
    console.log("Carta clickeada:", carta.dataset);

    if (!primerClick) {
        // PRIMER CLICK - SELECCIÓN
        const pilaCartaSeleccionada = columna[Number(carta.dataset.pila)];
        const indiceCartaSeleccionada = pilaCartaSeleccionada.findIndex(
            c => c.numero == carta.dataset.numero && c.color == carta.dataset.color
        );

        console.log("Intentando seleccionar carta en pila:", pilaCartaSeleccionada);
        console.log("Índice de la carta seleccionada:", indiceCartaSeleccionada);

        // Verificar si la carta está volteada
        if (indiceCartaSeleccionada === -1 || pilaCartaSeleccionada[indiceCartaSeleccionada].estaVolteada) {
            console.warn("Intentaste seleccionar una carta volteada o inexistente.");
            alert("No puedes seleccionar una carta volteada");
            return;
        }

        // Si la carta es válida, la seleccionamos
        primerClick = carta;
        carta.style.border = "2px solid red";
        console.log("Carta seleccionada correctamente:", primerClick.dataset);
    } else {
        // SEGUNDO CLICK - MOVIMIENTO
        const segundoClick = carta;
        const pilaPrimeraCarta = columna[Number(primerClick.dataset.pila)];
        const pilaSegundaCarta = columna[Number(segundoClick.dataset.pila)];

        console.log("Primer click (origen):", primerClick.dataset);
        console.log("Segundo click (destino):", segundoClick.dataset);
        console.log("Pila origen antes de mover:", pilaPrimeraCarta);
        console.log("Pila destino antes de mover:", pilaSegundaCarta);

        // Obtener el índice real de la carta en la pila de origen
        const indiceCartaSeleccionada = pilaPrimeraCarta.findIndex(
            c => c.numero == primerClick.dataset.numero && c.color == primerClick.dataset.color
        );

        console.log("Índice de la carta seleccionada en la pila:", indiceCartaSeleccionada);

        // Validar si la carta se puede mover sobre otra carta
        if (
            indiceCartaSeleccionada !== -1 &&
            Number(primerClick.dataset.numero) === Number(segundoClick.dataset.numero) - 1 &&
            segundoClick.dataset.color !== primerClick.dataset.color
        ) {
            // Mover todas las cartas desde la seleccionada hasta la última
            const cartasAMover = pilaPrimeraCarta.slice(indiceCartaSeleccionada); // Todas las cartas a partir de la seleccionada
            console.log("Cartas a mover:", cartasAMover);

            pilaSegundaCarta.push(...cartasAMover);

            // Eliminar las cartas movidas de la pila original
            pilaPrimeraCarta.splice(indiceCartaSeleccionada);

            // Voltear la nueva última carta de la columna de origen, si existe
            if (pilaPrimeraCarta.length > 0) {
                pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
                console.log("Volteando la nueva última carta en la pila de origen:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
            }

            ponerCartasColumna(); // Actualizar las pilas visualmente
        }
        // Movimiento especial: Rey a una columna vacía
        else if (Number(primerClick.dataset.numero) === 13 && segundoClick.dataset.fantasma !== undefined) {
            console.log("Moviendo Rey a una columna vacía.");
            const cartasAMover = pilaPrimeraCarta.slice(indiceCartaSeleccionada); // Todas las cartas a partir de la seleccionada
            pilaSegundaCarta.push(...cartasAMover);

            // Eliminar las cartas movidas de la pila original
            pilaPrimeraCarta.splice(indiceCartaSeleccionada);

            if (pilaPrimeraCarta.length > 0) {
                pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
                console.log("Volteando la nueva última carta después de mover el Rey:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
            }

            ponerCartasColumna(); // Actualizar las pilas visualmente
        }
        else {
            console.warn("Movimiento no permitido. No cumple las reglas.");
            alert("No se puede realizar el movimiento");
        }

        resetearSeleccion(); // Restablecer la selección
    }
};


// =====================
// FUNCIONES AUXILIARES
// =====================

// Restablece la selección de cartas
const resetearSeleccion = () => {
    if (primerClick) primerClick.style.border = "none";
    primerClick = null;
};

// =====================
// EVENTOS
// =====================
if (botonEmpezar) {
    botonEmpezar.onclick = () => {
        // Reiniciar variables y tablero
        mazo = [];
        mazoBarajado = [];
        columna = [];
        primerClick = null;

        crearMazo();
        barajarMazo();
        darCartas();
        ponerCartasColumna();
        /*ponerCartasInicio();*/
    };
} else {
    console.error("No se encontró el botón con la clase .adelante");
}



