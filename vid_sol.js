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

let tiempoInicio;
let intervaloReloj;
let contadorReinicios = 0; // Variable para contar los reinicios
let tiempoAcumulado = 0; // Variable para acumular el tiempo total entre reinicios
let contadorMovimientos = 0; // Variable para contar los movimientos realizados

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
    cartaFantasma.classList.add("carta", "fantasma"); 
    cartaFantasma.style.width = '120px';
    cartaFantasma.style.height = '173px';
    cartaFantasma.style.opacity = '100%'
    // Crear el elemento de imagen
    const imagen = document.createElement("img");
    imagen.src = 'Imagenes/rein.webp'; 
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

// Crea una carta fantasma en hogar
const crearCartaFantasmaHogar = (hogarIndex) => {
    const cartaFantasma = document.createElement("div");
    cartaFantasma.classList.add("carta", "fantasma");
    cartaFantasma.dataset.fantasma = "true";
    cartaFantasma.dataset.hogar = hogarIndex;
    cartaFantasma.style.width = '120px';
    cartaFantasma.style.height = '173px';
    cartaFantasma.style.opacity = '100%'
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


// Llama a esta función cuando necesites mover las cartas, por ejemplo, al hacer clic en la carta fantasma
const cartaFantasma = document.createElement("div");
cartaFantasma.onclick = () => {
    moverACartasSeleccionadas(); // Mueve las cartas al hacer clic en la carta fantasma
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

//Función para controlar el primer click
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

//Función para controlar el segundo click
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

    //Lógica de movimientos permitidos
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


// =====================================================
// FUNCIONES AUXILIARES PARA LOS MOVIMIENTOS PERMITIDOS
// =====================================================
const movimientoPermitido = (indiceCartaSeleccionada, segundoClick) => {
    return (
        indiceCartaSeleccionada !== -1 &&
        Number(primerClick.dataset.numero) === Number(segundoClick.dataset.numero) - 1 &&
        segundoClick.dataset.tipo !== primerClick.dataset.tipo && segundoClick.dataset.color !== primerClick.dataset.color
    );
};

const movimientoReyAColumnaVacia = (primerClick, segundoClick) => {
    return (
        Number(primerClick.dataset.numero) === 13 &&
        segundoClick.dataset.fantasma !== undefined &&
        segundoClick.dataset.pila !== undefined // Asegurar que la carta fantasma esté en la pila de columna
    );
};

const movimientoAsAHogar = (primerClick, segundoClick) => {
    const hogarIndex = Number(segundoClick.dataset.hogar);
    const hogarDestino = hogares[hogarIndex];

    // Comprobar si la pila de hogares está vacía
    if (hogarDestino.length === 0 && primerClick.dataset.numero === "1" && segundoClick.dataset.fantasma === "true") {
        return true;
    }
    return false;
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

    // Comprobar si la carta con numero === 13 puede moverse a una carta fantasma de la pila de hogares
    if (
        cartaSeleccionada.numero === 13 &&
        segundoClick.dataset.fantasma === "true" &&
        hogarDestino.length > 0 &&
        hogarDestino[hogarDestino.length - 1].numero === 12 &&
        hogarDestino[hogarDestino.length - 1].tipo === cartaSeleccionada.tipo
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
    contarMovimientos(); // Incrementar el contador de movimientos
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
    contarMovimientos(); // Incrementar el contador de movimientos
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
    contarMovimientos(); // Incrementar el contador de movimientos
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
    contarMovimientos(); // Incrementar el contador de movimientos

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
        detenerReloj(); // Detener el reloj cuando se verifica la victoria
        const tiempoTotal = (Date.now() - tiempoInicio) / 1000; // Tiempo total en segundos
        const puntuacion = calcularPuntuacion(tiempoTotal);
        guardarPuntuacion(puntuacion);
        mostrarVentanaVictoria(puntuacion);
    }
};

//Función para mostrar la ventana emergente de victoria
const mostrarVentanaVictoria = (puntuacion) => {
    detenerReloj(); // Detener el reloj
    const tiempoTotal = obtenerTiempoTotal(); // Obtener el tiempo total acumulado
    const modal = document.querySelector("#modal");
    const formularioAlias = document.querySelector("#formulario-alias");

    formularioAlias.onsubmit = (event) => {
        event.preventDefault();
        const alias = document.querySelector("#alias").value.trim();
        if (alias) {
            const esNuevoRecord = guardarEnXML(alias, puntuacion, tiempoTotal, contadorReinicios, contadorMovimientos); // Guardar datos en XML y comprobar si es un nuevo récord
            const registro= agregarRegistros(alias, puntuacion, tiempoTotal, contadorReinicios, contadorMovimientos); // Guardar datos en el registro
            modal.close(); // Cerrar la ventana emergente actual
            mostrarVentanaResultado(esNuevoRecord,puntuacion); // Mostrar la nueva ventana emergente
        } else {
            alert("Por favor, introduce un alias válido.");
        }
    };

    modal.showModal(); // Mostrar el formulario
};

// Nueva función para mostrar la ventana emergente con el resultado
const mostrarVentanaResultado = (esNuevoRecord,puntuacion) => {
    const nuevaVentana = document.createElement("dialog");
    nuevaVentana.classList.add("ventana");

    // Cambiar el fondo según el resultado
    const fondo = esNuevoRecord ? "Imagenes/recod.gif" : "Imagenes/Gracias.gif";

    nuevaVentana.style.backgroundImage = `url(${fondo})`;
    nuevaVentana.style.backgroundSize = "cover";
    nuevaVentana.style.backgroundPosition = "center";

    nuevaVentana.innerHTML = `
        
        <div>
            <h1 id= "resultado">PUNTUACIÓN: ${puntuacion}</h1>
            <button id="volver-jugar">Volver a jugar</button>
            <button id="volver-inicio">Inicio</button>
        </div>
    `;

    document.body.appendChild(nuevaVentana);

    // Botón para volver a jugar
    nuevaVentana.querySelector("#volver-jugar").onclick = () => {
        window.location.href = "Principal.html";
    };

    // Botón para volver al inicio
    nuevaVentana.querySelector("#volver-inicio").onclick = () => {
        window.location.href = "index.html";
    };

    nuevaVentana.showModal();
};

// Modificar la función guardarEnXML para devolver si es un nuevo récord
const guardarEnXML = (alias, puntuacion, tiempo, reinicio, movimientos) => {
    let xml = localStorage.getItem("EstadisticasXML");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    const usuariosNodo = xmlDoc.getElementsByTagName("usuarios")[0];
    const usuarios = Array.from(usuariosNodo.getElementsByTagName("usuario"));

    let esNuevoRecord = false;

    // Obtener la fecha y hora actual
    const fechaActual = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    const horaActual = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); // Formato HH:MM:SS

    // Verificar si el alias ya existe
    const usuarioExistente = usuarios.find(usuario => 
        usuario.getElementsByTagName("alias")[0]?.textContent === alias
    );

    if (usuarioExistente) {
        // Si el alias existe, comprobar la puntuación
        const puntuacionExistente = parseInt(usuarioExistente.getElementsByTagName("puntos")[0]?.textContent, 10);
        if (puntuacion > puntuacionExistente) {
            // Sobrescribir los datos si la nueva puntuación es mayor
            usuarioExistente.getElementsByTagName("puntos")[0].textContent = puntuacion;
            usuarioExistente.getElementsByTagName("tiempo")[0].textContent = tiempo;
            usuarioExistente.getElementsByTagName("reinicio")[0].textContent = reinicio;
            usuarioExistente.getElementsByTagName("movimientos")[0].textContent = movimientos;
            usuarioExistente.getElementsByTagName("fecha")[0].textContent = fechaActual; // Actualizar la fecha
            usuarioExistente.getElementsByTagName("hora")[0].textContent = horaActual; // Actualizar la hora
            console.log(`Puntuación actualizada para el alias: ${alias}`);
            esNuevoRecord = true;
        } else {
            console.log(`La puntuación no es mayor. No se actualizó el alias: ${alias}`);
        }
    } else {
        // Si el alias no existe y hay menos de 10 usuarios, agregar un nuevo usuario
        if (usuarios.length < 10) {
            const nuevoUsuario = xmlDoc.createElement("usuario");
            nuevoUsuario.innerHTML = `
                <alias>${alias}</alias>
                <puntos>${puntuacion}</puntos>
                <tiempo>${tiempo}</tiempo>
                <reinicio>${reinicio}</reinicio>
                <movimientos>${movimientos}</movimientos>
                <fecha>${fechaActual}</fecha>
                <hora>${horaActual}</hora>
            `;
            usuariosNodo.appendChild(nuevoUsuario);
            esNuevoRecord = true;
        } else {
            // Si hay 10 usuarios, verificar si el nuevo usuario puede reemplazar al último
            const usuariosOrdenados = usuarios.sort((a, b) => {
                const puntosA = parseInt(a.getElementsByTagName("puntos")[0]?.textContent, 10);
                const puntosB = parseInt(b.getElementsByTagName("puntos")[0]?.textContent, 10);
                if (puntosA === puntosB) {
                    const reiniciosA = parseInt(a.getElementsByTagName("reinicio")[0]?.textContent, 10);
                    const reiniciosB = parseInt(b.getElementsByTagName("reinicio")[0]?.textContent, 10);
                    return reiniciosA - reiniciosB; // Ordenar por menos reinicios en caso de empate
                }
                return puntosB - puntosA; // Ordenar por puntuación de mayor a menor
            });

            const ultimoUsuario = usuariosOrdenados[usuariosOrdenados.length - 1];
            const puntosUltimo = parseInt(ultimoUsuario.getElementsByTagName("puntos")[0]?.textContent, 10);
            const reiniciosUltimo = parseInt(ultimoUsuario.getElementsByTagName("reinicio")[0]?.textContent, 10);

            if (
                puntuacion > puntosUltimo || 
                (puntuacion === puntosUltimo && reinicio < reiniciosUltimo)
            ) {
                // Reemplazar al último usuario
                usuariosNodo.removeChild(ultimoUsuario);

                const nuevoUsuario = xmlDoc.createElement("usuario");
                nuevoUsuario.innerHTML = `
                    <alias>${alias}</alias>
                    <puntos>${puntuacion}</puntos>
                    <tiempo>${tiempo}</tiempo>
                    <reinicio>${reinicio}</reinicio>
                    <movimientos>${movimientos}</movimientos>
                    <fecha>${fechaActual}</fecha>
                    <hora>${horaActual}</hora>
                `;
                usuariosNodo.appendChild(nuevoUsuario);
                esNuevoRecord = true;
                console.log(`El usuario ${alias} reemplazó al último usuario en la base de datos.`);
            } else {
                console.log(`El usuario ${alias} no tiene mejor puntuación o menos reinicios que el último usuario.`);
            }
        }
    }

    // Limitar la base de datos a los 10 mejores usuarios
    const usuariosActualizados = Array.from(usuariosNodo.getElementsByTagName("usuario"))
        .sort((a, b) => {
            const puntosA = parseInt(a.getElementsByTagName("puntos")[0]?.textContent, 10);
            const puntosB = parseInt(b.getElementsByTagName("puntos")[0]?.textContent, 10);
            if (puntosA === puntosB) {
                const reiniciosA = parseInt(a.getElementsByTagName("reinicio")[0]?.textContent, 10);
                const reiniciosB = parseInt(b.getElementsByTagName("reinicio")[0]?.textContent, 10);
                return reiniciosA - reiniciosB; // Ordenar por menos reinicios en caso de empate
            }
            return puntosB - puntosA; // Ordenar por puntuación de mayor a menor
        })
        .slice(0, 10);

    // Limpiar los usuarios existentes y agregar los actualizados
    usuariosNodo.innerHTML = "";
    usuariosActualizados.forEach(usuario => usuariosNodo.appendChild(usuario));

    // Guardar los datos actualizados en localStorage
    const serializer = new XMLSerializer();
    localStorage.setItem("EstadisticasXML", serializer.serializeToString(xmlDoc));
    console.log("Datos guardados en EstadisticasXML:", serializer.serializeToString(xmlDoc));

    return esNuevoRecord;
};

const agregarRegistros = (alias, puntuacion, tiempo, reinicio, movimientos) => {
    let xml = localStorage.getItem("RegistrosXML");
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml || "<registros><usuarios></usuarios></registros>", "text/xml");

    const usuariosNodo = xmlDoc.getElementsByTagName("usuarios")[0];
    let usuarioExistente = Array.from(usuariosNodo.getElementsByTagName("usuario")).find(
        usuario => usuario.getElementsByTagName("alias")[0]?.textContent === alias
    );

    if (!usuarioExistente) {
        usuarioExistente = xmlDoc.createElement("usuario");
        usuarioExistente.innerHTML = `<alias>${alias}</alias>`;
        usuariosNodo.appendChild(usuarioExistente);
    }

    const nuevaEstadistica = xmlDoc.createElement("estadistica");
    nuevaEstadistica.innerHTML = `
        <fecha>${new Date().toISOString().split("T")[0]}</fecha>
        <hora>${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</hora>
        <puntos>${puntuacion}</puntos>
        <tiempo>${tiempo}</tiempo>
        <reinicio>${reinicio}</reinicio>
        <movimientos>${movimientos}</movimientos>
    `;
    usuarioExistente.appendChild(nuevaEstadistica);

    // Limitar a un máximo de 10 registros por usuario
    const estadisticas = Array.from(usuarioExistente.getElementsByTagName("estadistica"));
    if (estadisticas.length > 10) {
        usuarioExistente.removeChild(estadisticas[0]); // Eliminar el registro más antiguo
    }

    // Guardar los datos actualizados en localStorage
    const serializer = new XMLSerializer();
    localStorage.setItem("RegistrosXML", serializer.serializeToString(xmlDoc));
    console.log("Datos agregados en RegistrosXML:", serializer.serializeToString(xmlDoc));
};

//Funciones relacionadas con el reloj para pararlo, inicializarlo,actualizarlo
const iniciarReloj = () => {
    tiempoInicio = Date.now();
    intervaloReloj = setInterval(actualizarReloj, 1000);
};

const actualizarReloj = () => {
    const tiempoActual = Date.now();
    const tiempoTranscurrido = Math.floor((tiempoActual - tiempoInicio) / 1000);
    const minutos = Math.floor(tiempoTranscurrido / 60);
    const segundos = tiempoTranscurrido % 60;
    document.querySelector("#reloj").textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
};

const detenerReloj = () => {
    clearInterval(intervaloReloj);
};


//Funciones para calcular la puntuación y guardarla
const calcularPuntuacion = (tiempoTotal) => {
    let puntuacion = 5000; // Puntuación inicial
    const minutos = tiempoTotal / 60;
    if (minutos > 1) {
        puntuacion -= Math.round((minutos - 1) * 100); // Restar 100 puntos por cada minuto pasado después del primer minuto
    }
    if (0<=contadorReinicios && contadorReinicios <=2) {
        puntuacion += 200;
    }
    else{
        puntuacion -= contadorReinicios * 100;
    }
    

    return Math.max(puntuacion, 0); // Asegurar que la puntuación no sea negativa
};

const guardarPuntuacion = (puntuacion) => {
    const puntuaciones = JSON.parse(localStorage.getItem("puntuaciones")) || [];
    puntuaciones.push(puntuacion);
    localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
};


//Si le damos a la tecla esc va a la página principal
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        window.location.href = "index.html";
    }
});

//HACER TRAMPAS
const hacerTrampas = () => {
    hogares = [[], [], [], []]; // Reiniciar los hogares
    columna = Array.from({ length: 7 }, () => []); // Vaciar las columnas
    mazoBarajado = []; // Vaciar el mazo barajado

    // Colocar las cartas en los hogares excepto las de número 12 y 13
    TIPOS.forEach((tipo, index) => {
        for (let i = 1; i <= 11; i++) {
            hogares[index].push({
                numero: i,
                color: COLORES[tipo],
                tipo,
                img: `${i}${tipo}.png`,
                estaVolteada: false
            });
        }
    });

    // Colocar las cartas de número 12 y 13 en el mazoBarajado
    TIPOS.forEach(tipo => {
        for (let i = 12; i <= 13; i++) {
            mazoBarajado.push({
                numero: i,
                color: COLORES[tipo],
                tipo,
                img: `${i}${tipo}.png`,
                estaVolteada: true
            });
        }
    });

    // Actualizar visualmente los hogares
    hogares.forEach((hogar, index) => {
        const hogarElemento = document.querySelector(`#hogar-${index}`);
        if (hogarElemento) {
            hogarElemento.innerHTML = ""; // Limpiar el contenido del hogar
            hogar.forEach(carta => {
                const cartaHTML = crearCartaHTML(carta);
                hogarElemento.appendChild(cartaHTML);
            });
            // Agregar carta fantasma en la última posición
            const cartaFantasma = crearCartaFantasmaHogar(index);
            hogarElemento.appendChild(cartaFantasma);
        }
    });

    // Actualizar visualmente el mazo de inicio
    inicial.innerHTML = ""; // Limpiar el mazo de inicio
    mazoBarajado.forEach(carta => {
        const cartaHTML = crearCartaHTML(carta);
        inicial.appendChild(cartaHTML);
    });

    console.log("Hogares después de hacer trampas:", hogares);
    console.log("Mazo barajado después de hacer trampas:", mazoBarajado);
};

//TERMINA HACER TRAMPAS

// =====================
// BASE DE DATOS
// =====================

// Función para inicializar la base de datos si no existe
const inicializarBaseDeDatos = () => {
    const xml = `<estadistica>
        <usuarios>
        </usuarios>
    </estadistica>`;
    localStorage.setItem("EstadisticasXML", xml);
    console.log("Base de datos inicializada.");
};

// Llamar a inicializarBaseDeDatos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("EstadisticasXML")) {
        inicializarBaseDeDatos();
    } else {
        console.log("Base de datos ya existente. Datos cargados desde localStorage.");
    }
});

// ===========================
// EVENTO BOTÓN EMPEZAR JUEGO
// ===========================
let juegoIniciado = false; // Variable para controlar si el juego ya ha comenzado

if (botonEmpezar) {
    botonEmpezar.onclick = () => {
        if (juegoIniciado) {
            detenerTiempo(); // Detener y acumular el tiempo antes de reiniciar
            incrementarReinicios(); // Incrementar el contador de reinicios
        } else {
            juegoIniciado = true; // Marcar que el juego ha comenzado
        }

        contadorMovimientos = 0; // Reiniciar el contador de movimientos
        calcularTiempo(); // Iniciar el cálculo del tiempo
        detenerReloj(); // Detener el reloj antes de reiniciar el juego

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
        agregarCartasFantasmaHogar();
        crearPilasHogar();
        /*ponerCartasColumna();*/
        ponerCartasInicio();
        hacerTrampas(); // Llamar al método hacerTrampas
        iniciarReloj(); // Iniciar el reloj
    };
} else {
    console.error("No se encontró el botón con la clase .adelante");
}

// Función para incrementar el contador de reinicios
const incrementarReinicios = () => {
    contadorReinicios++;
    console.log(`Reinicios: ${contadorReinicios}`);
};

// Función para iniciar el cálculo del tiempo
const calcularTiempo = () => {
    tiempoInicio = Date.now(); // Guardar el tiempo actual como inicio
    console.log("Tiempo iniciado:", tiempoInicio);
};

// Función para detener el cálculo del tiempo y acumularlo
const detenerTiempo = () => {
    if (!tiempoInicio) {
        console.error("El tiempo no se ha iniciado correctamente.");
        return;
    }
    const tiempoFin = Date.now(); // Guardar el tiempo actual como fin
    tiempoAcumulado += Math.floor((tiempoFin - tiempoInicio) / 1000); // Acumular el tiempo transcurrido en segundos
    tiempoInicio = null; // Reiniciar tiempoInicio para evitar cálculos incorrectos
    console.log("Tiempo acumulado:", tiempoAcumulado, "segundos");
};

// Función para obtener el tiempo total acumulado
const obtenerTiempoTotal = () => {
    if (tiempoInicio) {
        detenerTiempo(); // Asegurarse de acumular el tiempo actual antes de devolver el total
    }
    console.log("Tiempo total acumulado:", tiempoAcumulado, "segundos");
    return tiempoAcumulado;
};

// Función para incrementar el contador de movimientos
const contarMovimientos = () => {
    contadorMovimientos++;
    console.log(`Movimientos realizados: ${contadorMovimientos}`);
};







