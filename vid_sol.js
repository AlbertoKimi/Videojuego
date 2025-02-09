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
    console.log("Creado mazo barajado:" , mazoBarajado);
    
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
    cartaFantasma.style.opacity= '100%'
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
    cartaFantasma.style.opacity= '100%'
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
        mazoBaraja.innerHTML="";
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

    /*console.log("Carta movida a 'c_seleccionada':", cartaMovida);*/
    console.log("Mazo Barajado ", mazoBarajado);
});


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
    console.log("Creado mazo columna:" , columna);
};


// =====================
// LÓGICA DE MOVIMIENTO
// =====================

//Mover cartas en la parte de abajo
const comprobarClick = (carta) => {
    console.log("Carta clickeada:", carta.dataset);

    if (!primerClick) {
        // PRIMER CLICK - SELECCIÓN
        const pilaCartaSeleccionada = columna[Number(carta.dataset.pila)];
        const indiceCartaSeleccionada = pilaCartaSeleccionada.findIndex(
            c => {
                console.log(carta, columna[Number(carta.dataset.pila)])
                return c.numero == carta.dataset.numero && c.tipo == carta.dataset.tipo;
            }
        );
        console.log(columna);
        console.log("Intentando seleccionar carta en pila:", pilaCartaSeleccionada);
        console.log("Índice de la carta seleccionada:", indiceCartaSeleccionada);

        // Verificar si la carta está volteada
        if (indiceCartaSeleccionada === -1 || pilaCartaSeleccionada[indiceCartaSeleccionada].estaVolteada) {
            console.log(columna);
            console.log(primerClick);
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
        let pilaOrigen = null;
        let columnaIndex = -1;

        columna.forEach((pila, index) => {
            if (pila.some(c => c.numero == primerClick.dataset.numero && c.tipo == primerClick.dataset.tipo)) {
                pilaOrigen = pila;
                columnaIndex = index;
            }
        });

        // Detectar si el segundo clic es un hogar válido
        let hogarIndex = -1;
        hogares.forEach((pila, index) => {
            if (pila.length > 0 && pila[pila.length - 1].tipo === segundoClick.dataset.tipo) {
                hogarIndex = index;
            }
        });


        console.log("Primer click (origen):", primerClick.dataset);
        console.log("Segundo click (destino):", segundoClick.dataset);
        console.log("Pila origen antes de mover:", pilaPrimeraCarta);
        console.log("Pila destino antes de mover:", pilaSegundaCarta);

        // Obtener el índice real de la carta en la pila de origen
        const indiceCartaSeleccionada = pilaPrimeraCarta.findIndex(
            c => c.numero == primerClick.dataset.numero && c.tipo == primerClick.dataset.tipo
        );

        console.log("Índice de la carta seleccionada en la pila:", indiceCartaSeleccionada);

        // Validar si la carta se puede mover sobre otra carta
        if (
            indiceCartaSeleccionada !== -1 &&
            Number(primerClick.dataset.numero) === Number(segundoClick.dataset.numero) - 1 &&
            segundoClick.dataset.tipo !== primerClick.dataset.tipo && segundoClick.dataset.color !== primerClick.dataset.color//CORREGIR--> PUEDO MOVER DISTINTO TIPO E IGUAL COLOR
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

        // Mov número +1 y mismo tipo a la pila hogar
else if (pilaOrigen && hogarIndex !== -1) {
    const cartaSeleccionada = pilaOrigen[pilaOrigen.length - 1];
    const hogarDestino = hogares[hogarIndex];

    // Validar si la carta puede moverse al hogar
    if (
        (hogarDestino.length === 0 && cartaSeleccionada.numero === 1) || // Permitir Ases en pilas vacías
        (hogarDestino.length > 0 &&
            cartaSeleccionada.numero === hogarDestino[hogarDestino.length - 1].numero + 1 &&
            cartaSeleccionada.tipo === hogarDestino[hogarDestino.length - 1].tipo)
    ) {
        // Mover la carta al hogar
        pilaOrigen.pop();
        cartaSeleccionada.estaVolteada = false; // Asegurar que la carta se voltee
        hogarDestino.push(cartaSeleccionada);

        // ✅ **Actualizar visualmente el hogar**
        const hogarElemento = document.querySelector(`#hogar-${hogarIndex}`);
        if (hogarElemento) {
            hogarElemento.innerHTML = ""; // Limpiar hogar antes de agregar la nueva carta
            const nuevaCartaHTML = crearCartaHTML(cartaSeleccionada); // Crear carta con datos reales
            hogarElemento.appendChild(nuevaCartaHTML);

            // Agregar carta fantasma nuevamente para permitir más movimientos
            /*const cartaFantasma = crearCartaFantasmaHogar(hogarIndex);
            hogarElemento.appendChild(cartaFantasma);*/
        }

        // ✅ **Si la pila de origen aún tiene cartas, voltear la última**
        if (pilaOrigen.length > 0) {
            pilaOrigen[pilaOrigen.length - 1].estaVolteada = false;
        }

        console.log(`Carta movida a hogar-${hogarIndex}:`, cartaSeleccionada);
        console.log(hogares);
    } else {
        console.log("Movimiento no permitido. No cumple las reglas.");
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
        // Movimiento especial: Si el primerClick es un As (número 1) y el segundoClick es una carta fantasma de hogar
        else if (primerClick.dataset.numero === "1" && segundoClick.dataset.fantasma === "true" && segundoClick.dataset.hogar !== undefined) {
            console.log("Moviendo As a hogar.");

            const hogarIndex = Number(segundoClick.dataset.hogar);
            const hogarDestino = hogares[hogarIndex];
        
            // Remover la carta del origen
            let cartaAMover = null;
            for (let pila of columna) {
                const indiceCarta = pila.findIndex(c => c.numero == primerClick.dataset.numero && c.tipo == primerClick.dataset.tipo);
                if (indiceCarta !== -1) {
                    cartaAMover = pila.splice(indiceCarta, 1)[0]; // Eliminar la carta del origen
                    break;
                }
            }
        
            if (!cartaAMover) {
                console.warn("No se encontró la carta para mover.");
                return;
            }
        
            cartaAMover.estaVolteada = false; // Asegurar que se muestre correctamente
            hogarDestino.push(cartaAMover); // Agregar la carta al hogar en el array
        
            // ✅ **Actualizar visualmente el hogar**
            const hogarElemento = document.querySelector(`#hogar-${hogarIndex}`);
            if (hogarElemento) {
                hogarElemento.innerHTML = ""; // Limpiar hogar antes de agregar la nueva carta
                const nuevaCartaHTML = crearCartaHTML(cartaAMover);
                hogarElemento.appendChild(nuevaCartaHTML);
            }
            console.log(hogares);
            ponerCartasColumna(); // Actualizar las pilas visualmente
        }
        else {
            console.warn("Movimiento no permitido. No cumple las reglas.");
            alert("No se puede realizar el movimiento");
        }

        resetearSeleccion(); // Restablecer la selección
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



