// =====================
// VARIABLES GLOBALES
// =====================
let mazo = [];
let mazoBarajado = [];
let columna = [];
let seleccionar = [];
let hogares = [[], [], [], []];
let primerClick = null;

const TIPOS = ["Co", "Tr", "Di", "Pi"];
const COLORES = { Co: "rojo", Tr: "negro", Di: "rojo", Pi: "negro" };

// =====================
// ELEMENTOS DEL DOM
// =====================
const botonEmpezar = document.querySelector(".adelante");
const inicial = document.querySelector("#posicion_inicial");
const mazoBaraja = document.querySelector(".carta-baraja");

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
    console.log(mazo);
    console.log("Creado mazo barajado:", mazoBarajado);

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

const crearCartaFantasma1 = () => {
    const cartaFantasma = document.createElement("div");
    cartaFantasma.classList.add("carta", "fantasma"); // Asegúrate de tener estilos para .fantasma
    cartaFantasma.style.width = '120px';
    cartaFantasma.style.height = '173px';
    cartaFantasma.style.opacity = '100%'
    // Crear el elemento de imagen
    const imagen = document.createElement("img");
    imagen.src = 'Imagenes/rein.webp'; // Asegúrate de que la ruta de la imagen sea correcta
    imagen.alt = "Carta Fantasma"; // Texto alternativo para la imagen
    imagen.style.width = '100%'; // Ajustar el tamaño de la imagen al contenedor
    imagen.style.height = '100%'; // Ajustar el tamaño de la imagen al contenedor
    imagen.style.objectFit = 'cover'; // Asegura que la imagen cubra el contenedor

    // Agregar la imagen al contenedor de la carta fantasma
    cartaFantasma.appendChild(imagen);
    // Agregar evento de clic a la carta fantasma
    cartaFantasma.onclick = () => {
        moverCartasDeSeleccionadasAInicio(); // Mueve las cartas al hacer clic en la carta fantasma
        // Limpiar la carta seleccionada visualmente
        const espacioSeleccionado = document.querySelector("#c_seleccionada");
        if (espacioSeleccionado) {
            espacioSeleccionado.innerHTML = "";
        }
        cartaFantasma.remove(); // Elimina la carta fantasma del DOM
    }

    return cartaFantasma;
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

const crearCartaFantasmaHogar = (hogarIndex) => {
    const cartaFantasma = document.createElement("div");
    cartaFantasma.classList.add("carta", "fantasma");
    cartaFantasma.dataset.fantasma = "true";
    cartaFantasma.dataset.hogar = hogarIndex;
    cartaFantasma.style.width = '120px';
    cartaFantasma.style.height = '173px';
    cartaFantasma.style.opacity = '100%'
    /*cartaFantasma.style.display = 'inline-block';*/
    cartaFantasma.style.top = '5px';
    cartaFantasma.onclick = () => comprobarClick(cartaFantasma);
    return cartaFantasma;
};

// Agrega cartas fantasma en cada hogar asegurando que se generen correctamente
const agregarCartasFantasmaHogar = () => {
    for (let i = 0; i < 4; i++) {
        const hogar = document.querySelector(`#hogar-${i}`);
        if (hogar) {
            hogar.innerHTML = ''; // Limpiar el contenido del hogar para evitar duplicados
            const imagen = document.createElement("img");
            imagen.src = `Imagenes/AS_${TIPOS[i]}.webp`; // Restaurar imagen base del hogar
            imagen.alt = `As de ${TIPOS[i]}`;
            hogar.appendChild(imagen);

            const cartaFantasma = crearCartaFantasmaHogar(i);
            hogar.appendChild(cartaFantasma);
        }
    }
};

// =====================
// CREAR PILAS DE HOGAR
// =====================
const crearPilasHogar = () => {
    hogares = [[], [], [], []]; // Reinicializar hogares correctamente
    console.log("Pilas de hogar creadas:", hogares);
};

//Coloca las cartas en el inicio

const ponerCartasInicio = () => {

    for (let i = 0; i < mazoBarajado.length; i++) {
        const carta = mazoBarajado[i];
        const cartaHTML = crearCartaHTML(carta);
        inicial.appendChild(cartaHTML);
    }
}

// Función para mover todas las cartas de seleccionar a mazoBarajado
const moverCartasDeSeleccionadasAInicio = () => {
    if (seleccionar.length > 0) { // Verifica que haya cartas para mover
        mazoBarajado.push(...seleccionar); // Mueve todas las cartas al mazo barajado
        seleccionar = []; // Limpia la pila de selección
        console.log("Cartas movidas al mazo barajado:", mazoBarajado);
    } else {
        console.warn("No hay cartas en la pila de selección para mover.");
    }
};

// Ejemplo de uso
// Llama a esta función cuando necesites mover las cartas, por ejemplo, al hacer clic en la carta fantasma
const cartaFantasma = document.createElement("div");
cartaFantasma.onclick = () => {
    moverCartasSeleccionadas(); // Mueve las cartas al hacer clic en la carta fantasma
    cartaFantasma.remove(); // Elimina la carta fantasma del DOM
};

const moverACartasSeleccionadas = (carta) => {
    seleccionar.push(carta); // Agregar la carta seleccionada al array seleccionar
    console.log("Carta seleccionada y añadida a 'seleccionar':", carta);
    console.log("Mazo seleccionar ", seleccionar);
};


// Seleccionar carta al hacer clic en mazoBarajado
mazoBaraja.addEventListener("click", () => {
    if (mazoBarajado.length === 0) {
        console.warn("El mazo está vacío.");
        console.log(mazoBarajado);
        mazoBaraja.innerHTML = "";
        // Limpiar el contenido
        const cartaFantasma = crearCartaFantasma1(); // Crear la carta fantasma
        mazoBaraja.appendChild(cartaFantasma); // Agregar la carta fantasma al contenedor
        return;

    }

    // Tomar la primera carta del mazo barajado
    const cartaMovida = mazoBarajado.shift();
    cartaMovida.estaVolteada = false; // Asegurar que se voltee al moverse

    // Mover la carta seleccionada al array 'seleccionar'
    moverACartasSeleccionadas(cartaMovida);

    // Obtener el contenedor donde se mostrará la carta
    const espacioSeleccionado = document.querySelector("#c_seleccionada");

    if (espacioSeleccionado) {
        espacioSeleccionado.innerHTML = ""; // Limpiar espacio anterior
        const cartaHTML = crearCartaHTML(cartaMovida);
        espacioSeleccionado.appendChild(cartaHTML);
    } else {
        console.error("No se encontró el contenedor 'c_seleccionada'.");
    }

    // Deseleccionar primerClick si existe
    if (primerClick) {
        primerClick.style.border = "none";
        primerClick = null;
    }

    console.log("Mazo Barajado ", mazoBarajado);
});

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
    console.log("Creado mazo columna:", columna);
};


// =====================
// LÓGICA DE MOVIMIENTO
// =====================

//Mover cartas en la parte de abajo
const comprobarClick = (carta) => {
    console.log("Carta clickeada:", carta.dataset);

    if (!primerClick) {
        seleccionarPrimerClick(carta);
    } else {
        procesarSegundoClick(carta);
    }
};

const seleccionarPrimerClick = (carta) => {
    let pilaCartaSeleccionada = [];
    if (carta.parentElement.id === "c_seleccionada") {
        pilaCartaSeleccionada = seleccionar;
    } else {
        pilaCartaSeleccionada = columna[Number(carta.dataset.pila)];
    }

    const indiceCartaSeleccionada = pilaCartaSeleccionada.findIndex(
        c => c.numero == carta.dataset.numero && c.tipo == carta.dataset.tipo
    );

    console.log(columna);
    console.log("Intentando seleccionar carta en pila:", pilaCartaSeleccionada);
    console.log("Índice de la carta seleccionada:", indiceCartaSeleccionada);

    if (indiceCartaSeleccionada === -1 || pilaCartaSeleccionada[indiceCartaSeleccionada].estaVolteada) {
        console.warn("Intentaste seleccionar una carta volteada o inexistente.");
        alert("No puedes seleccionar una carta volteada");
        return;
    }

    primerClick = carta;
    carta.style.border = "2px solid red";
    console.log("Carta seleccionada correctamente:", primerClick.dataset);
};

const procesarSegundoClick = (carta) => {
    console.log("Mazo seleccionar antes de mover:", seleccionar);

    const segundoClick = carta;
    let pilaPrimeraCarta = [];
    let pilaSegundaCarta = [];

    if (primerClick.parentElement.id === "c_seleccionada") {
        pilaPrimeraCarta = seleccionar;
    } else {
        pilaPrimeraCarta = columna[Number(primerClick.dataset.pila)];
    }

    if (segundoClick.dataset.pila !== undefined) {
        pilaSegundaCarta = columna[Number(segundoClick.dataset.pila)];
    } else if (segundoClick.dataset.hogar !== undefined) {
        pilaSegundaCarta = hogares[Number(segundoClick.dataset.hogar)];
    }

    let hogarIndex = -1;
    hogares.forEach((pila, index) => {
        if (pila.length > 0 && pila[pila.length - 1].tipo === segundoClick.dataset.tipo) {
            hogarIndex = index;
        }
    });

    let indiceCartaSeleccionada = -1;
    if (primerClick.parentElement.id === "c_seleccionada") {
        indiceCartaSeleccionada = seleccionar.findIndex(
            c => c.numero == primerClick.dataset.numero && c.tipo == primerClick.dataset.tipo
        );
    } else {
        indiceCartaSeleccionada = pilaPrimeraCarta.findIndex(
            c => c.numero == primerClick.dataset.numero && c.tipo == primerClick.dataset.tipo
        );
    }

    console.log("Índice de la carta seleccionada:", indiceCartaSeleccionada);

    if (movimientoPermitido(indiceCartaSeleccionada, segundoClick)) {
        moverCartas(pilaPrimeraCarta, pilaSegundaCarta, indiceCartaSeleccionada);
    } else if (movimientoReyAColumnaVacia(primerClick, segundoClick)) {
        moverReyAColumnaVacia(pilaPrimeraCarta, segundoClick, indiceCartaSeleccionada);
    } else if (movimientoAsAHogar(primerClick, segundoClick)) {
        moverAsAHogar(primerClick, segundoClick, indiceCartaSeleccionada);
    } else if (movimientoCartaAHogar(primerClick, segundoClick, pilaPrimeraCarta, indiceCartaSeleccionada)) {
        moverCartaAHogar(primerClick, segundoClick, pilaPrimeraCarta, indiceCartaSeleccionada);
    } else {
        console.warn("Movimiento no permitido. No cumple las reglas.");
        alert("No se puede realizar el movimiento");
    }

    resetearSeleccion();
};

const movimientoPermitido = (indiceCartaSeleccionada, segundoClick) => {
    return (
        indiceCartaSeleccionada !== -1 &&
        Number(primerClick.dataset.numero) === Number(segundoClick.dataset.numero) - 1 &&
        segundoClick.dataset.tipo !== primerClick.dataset.tipo && segundoClick.dataset.color !== primerClick.dataset.color
    );
};

const movimientoReyAColumnaVacia = (primerClick, segundoClick) => {
    return Number(primerClick.dataset.numero) === 13 && segundoClick.dataset.fantasma !== undefined;
};

const movimientoAsAHogar = (primerClick, segundoClick) => {
    return primerClick.dataset.numero === "1" && segundoClick.dataset.fantasma === "true" && segundoClick.dataset.hogar !== undefined;
};

const movimientoCartaAHogar = (primerClick, segundoClick, pilaPrimeraCarta, indiceCartaSeleccionada) => {
    const hogarIndex = Number(segundoClick.dataset.hogar);
    const hogarDestino = hogares[hogarIndex];
    const cartaSeleccionada = primerClick.parentElement.id === "c_seleccionada" ? seleccionar[indiceCartaSeleccionada] : pilaPrimeraCarta[indiceCartaSeleccionada];

    if (
        hogarDestino &&
        ((hogarDestino.length === 0 && cartaSeleccionada.numero === 1) || // Permitir Ases en pilas vacías
        (hogarDestino.length > 0 &&
            cartaSeleccionada.numero === hogarDestino[hogarDestino.length - 1].numero + 1 &&
            cartaSeleccionada.tipo === hogarDestino[hogarDestino.length - 1].tipo))
    ) {
        return true;
    }
    return false;
};

const moverCartas = (pilaPrimeraCarta, pilaSegundaCarta, indiceCartaSeleccionada) => {
    const cartasAMover = pilaPrimeraCarta.slice(indiceCartaSeleccionada);
    console.log("Cartas a mover:", cartasAMover);

    pilaSegundaCarta.push(...cartasAMover);
    pilaPrimeraCarta.splice(indiceCartaSeleccionada, cartasAMover.length);

    if (primerClick.parentElement.id === "c_seleccionada") {
        seleccionar.splice(indiceCartaSeleccionada, cartasAMover.length);
        actualizarSeleccionVisual();
    }

    if (pilaPrimeraCarta.length > 0) {
        pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
        console.log("Volteando la nueva última carta en la pila de origen:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
    }

    ponerCartasColumna();
};

const moverReyAColumnaVacia = (pilaPrimeraCarta, segundoClick, indiceCartaSeleccionada) => {
    const cartasAMover = pilaPrimeraCarta.slice(indiceCartaSeleccionada);
    console.log("Cartas a mover:", cartasAMover);

    if (segundoClick.dataset.pila !== undefined) {
        const pilaSegundaCarta = columna[Number(segundoClick.dataset.pila)];
        pilaSegundaCarta.push(...cartasAMover);
    } else if (segundoClick.dataset.hogar !== undefined) {
        const hogarDestino = hogares[Number(segundoClick.dataset.hogar)];
        hogarDestino.push(...cartasAMover);

        // Actualizar visualmente el hogar
        const hogarElemento = document.querySelector(`#hogar-${Number(segundoClick.dataset.hogar)}`);
        if (hogarElemento) {
            hogarElemento.innerHTML = "";
            hogarDestino.forEach(carta => {
                const cartaHTML = crearCartaHTML(carta);
                hogarElemento.appendChild(cartaHTML);
            });
            // Agregar carta fantasma en la última posición
            const cartaFantasma = crearCartaFantasmaHogar(Number(segundoClick.dataset.hogar));
            hogarElemento.appendChild(cartaFantasma);
        }
    }

    pilaPrimeraCarta.splice(indiceCartaSeleccionada, cartasAMover.length);

    if (primerClick.parentElement.id === "c_seleccionada") {
        seleccionar.splice(indiceCartaSeleccionada, cartasAMover.length);
        actualizarSeleccionVisual();
    }

    if (pilaPrimeraCarta.length > 0) {
        pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
        console.log("Volteando la nueva última carta en la pila de origen:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
    }

    ponerCartasColumna();
    verificarVictoria();
};

const moverAsAHogar = (primerClick, segundoClick, indiceCartaSeleccionada) => {
    const hogarIndex = Number(segundoClick.dataset.hogar);
    const hogarDestino = hogares[hogarIndex];

    let cartaAMover = null;
    if (primerClick.parentElement.id === "c_seleccionada") {
        cartaAMover = seleccionar.splice(indiceCartaSeleccionada, 1)[0];
        actualizarSeleccionVisual();
    } else {
        for (let pila of columna) {
            const indiceCarta = pila.findIndex(c => c.numero == primerClick.dataset.numero && c.tipo == primerClick.dataset.tipo);
            if (indiceCarta !== -1) {
                cartaAMover = pila.splice(indiceCarta, 1)[0];
                break;
            }
        }
    }

    if (!cartaAMover) {
        console.warn("No se encontró la carta para mover.");
        return;
    }

    cartaAMover.estaVolteada = false;
    hogarDestino.push(cartaAMover);

    const hogarElemento = document.querySelector(`#hogar-${hogarIndex}`);
    if (hogarElemento) {
        hogarElemento.innerHTML = "";
        const nuevaCartaHTML = crearCartaHTML(cartaAMover);
        hogarElemento.appendChild(nuevaCartaHTML);
        hogarElemento.appendChild(crearCartaFantasmaHogar(hogarIndex)); // Agregar carta fantasma
    }

    console.log(hogares);
    ponerCartasColumna();
    verificarVictoria();
};

const moverCartaAHogar = (primerClick, segundoClick, pilaPrimeraCarta, indiceCartaSeleccionada) => {
    const hogarIndex = Number(segundoClick.dataset.hogar);
    const hogarDestino = hogares[hogarIndex];
    const cartaSeleccionada = primerClick.parentElement.id === "c_seleccionada" ? seleccionar[indiceCartaSeleccionada] : pilaPrimeraCarta[indiceCartaSeleccionada];

    const hogarElemento = document.querySelector(`#hogar-${hogarIndex}`);
    if (hogarElemento) {
        hogarElemento.innerHTML = "";
    }

    if (primerClick.parentElement.id === "c_seleccionada") {
        seleccionar.splice(indiceCartaSeleccionada, 1);
    } else {
        pilaPrimeraCarta.splice(indiceCartaSeleccionada, 1);
    }
    cartaSeleccionada.estaVolteada = false;
    hogarDestino.push(cartaSeleccionada);

    if (hogarElemento) {
        const nuevaCartaHTML = crearCartaHTML(cartaSeleccionada);
        hogarElemento.appendChild(nuevaCartaHTML);
        hogarElemento.appendChild(crearCartaFantasmaHogar(hogarIndex)); // Agregar carta fantasma
    }

    actualizarSeleccionVisual();
    console.log(`Carta movida a hogar-${hogarIndex}:`, cartaSeleccionada);
    console.log(hogares);
    verificarVictoria();

    if (pilaPrimeraCarta.length > 0) {
        pilaPrimeraCarta[pilaPrimeraCarta.length - 1].estaVolteada = false;
        console.log("Volteando la nueva última carta en la pila de origen:", pilaPrimeraCarta[pilaPrimeraCarta.length - 1]);
    }

    ponerCartasColumna();
};

const actualizarSeleccionVisual = () => {
    const espacioSeleccionado = document.querySelector("#c_seleccionada");
    if (espacioSeleccionado) {
        espacioSeleccionado.innerHTML = "";

        if (seleccionar.length > 0) {
            const nuevaCartaHTML = crearCartaHTML(seleccionar[seleccionar.length - 1]);
            espacioSeleccionado.appendChild(nuevaCartaHTML);
        }
    }
};

// Función para encontrar en qué pila está una carta
const encontrarPilaCarta = (carta) => {
    for (let i = 0; i < columna.length; i++) {
        if (columna[i].some(c => c.numero == carta.dataset.numero && c.tipo == carta.dataset.tipo)) {
            return { pila: columna[i], tipo: "columna", index: i };
        }
    }
    for (let i = 0; i < hogares.length; i++) {
        if (hogares[i].some(c => c.numero == carta.dataset.numero && c.tipo == carta.dataset.tipo)) {
            return { pila: hogares[i], tipo: "hogar", index: i };
        }
    }
    return null;
};

// Función para mover la carta de una pila a otra
const moverCarta = (pilaOrigen, pilaDestino) => {
    const cartaAMover = pilaOrigen.pop();

    // Asegurar que la carta se voltea al moverse a hogar
    if (pilaDestino === hogares.find(h => h === pilaDestino)) {
        cartaAMover.estaVolteada = false;
    }

    pilaDestino.push(cartaAMover);
    console.log(`Carta movida a ${pilaDestino === hogares ? "hogar" : "columna"}`, cartaAMover);
};


// =====================
// FUNCIONES AUXILIARES
// =====================

// Restablece la selección de cartas
const resetearSeleccion = () => {
    if (primerClick) primerClick.style.border = "none";
    primerClick = null;
};

// Función para verificar si el jugador ha ganado
const verificarVictoria = () => {
    const haGanado = hogares.every(hogar => hogar.length > 0 && hogar[hogar.length - 1].numero === 13);
    if (haGanado) {
        mostrarVentanaVictoria();
    }
};

// Función para mostrar la ventana emergente de victoria
const mostrarVentanaVictoria = () => {
    // Crear el contenedor de la ventana emergente
    const ventana = document.createElement("div");
    ventana.style.position = "fixed";
    ventana.style.top = "50%";
    ventana.style.left = "50%";
    ventana.style.width = "300px";
    ventana.style.height = "200px";
    ventana.style.transform = "translate(-50%, -50%)";
    ventana.style.backgroundColor = "white";
    ventana.style.padding = "20px";
    ventana.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    ventana.style.zIndex = "1000";
    ventana.style.textAlign = "center";

    // Crear el mensaje de victoria
    const mensaje = document.createElement("p");
    mensaje.textContent = "ENHORABUENA HAS GANADO";
    mensaje.style.fontSize = "24px";
    mensaje.style.marginBottom = "20px";
    ventana.appendChild(mensaje);

    // Crear el botón de jugar de nuevo
    const botonJugarDeNuevo = document.createElement("button");
    botonJugarDeNuevo.textContent = "JUGAR DE NUEVO";
    botonJugarDeNuevo.style.marginRight = "20px";
    botonJugarDeNuevo.onclick = () => {
        ventana.remove();
        // Reiniciar el juego
        botonEmpezar.click();
    };
    ventana.appendChild(botonJugarDeNuevo);

    // Crear el botón de página inicial
    const botonPaginaInicial = document.createElement("button");
    botonPaginaInicial.textContent = "PÁGINA INICIAL";
    botonPaginaInicial.onclick = () => {
        ventana.remove();
        // Redirigir a la página inicial (ajusta la URL según sea necesario)
        window.location.href = "index.html";
    };
    ventana.appendChild(botonPaginaInicial);

    // Agregar la ventana emergente al cuerpo del documento
    document.body.appendChild(ventana);
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
        // Limpiar la carta seleccionada visualmente
        const espacioSeleccionado = document.querySelector("#c_seleccionada");
        if (espacioSeleccionado) {
            espacioSeleccionado.innerHTML = "";
        }
        // Limpiar la imagen reiniciar
        const dorso = document.querySelector(".carta-baraja");
        if (dorso) {
            dorso.innerHTML = "";
        }
        seleccionar = [];
        hogares = [[], [], [], []];
        primerClick = null;

        crearMazo();
        barajarMazo();
        darCartas();
        ponerCartasColumna();
        agregarCartasFantasmaHogar();
        crearPilasHogar();
        ponerCartasInicio();
    };
} else {
    console.error("No se encontró el botón con la clase .adelante");
}






