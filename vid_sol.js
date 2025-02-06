//Constantes y tipos

let mazo = []
let mazoBarajado = []
let columna = []
let primerClick = null;


const tipos = ["Co", "Di", "Tr", "Pi"]
const color = {
    Co: "rojo",
    Di: "rojo",
    Tr: "negro",
    Pi: "negro"
}

//Elementos html

const botonEmpezar = document.querySelector(".adelante");
const inicial = document.querySelector("#posicion_inicial")
const mazoBaraja = document.querySelector("#mazo-baraja"); //



//Funciones

const crearMazo = () => {
    for (let i = 1; i <= 13; i++) {
        for (let j = 0; j < tipos.length; j++) {
            const carta = {
                numero: i,
                color: color[tipos[j]],
                tipo: tipos[j],
                img: `${i}${tipos[j]}.png`,
                estaVolteada: true,
            }
            mazo.push(carta)
        }
    }
}

const barajarMazo = () => {
    mazoBarajado = mazo.map(carta => ({ carta, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ carta }) => carta)
}

const darCartas = () => {
    for (let i = 0; i < 7; i++) {
        columna.push([])
        for (let j = 0; j < i + 1; j++) {
            const primeraCartaMazo = mazoBarajado[0]
            mazoBarajado.shift()
            columna[i].push(primeraCartaMazo)
        }

    }
    console.log(mazoBarajado)
    console.log(columna)
}

const crearCartaHTML = (carta) => {
    const cartaHTML = document.createElement("div")
    const foto = document.createElement("img")
    if (carta.estaVolteada) {
        foto.src = "Imagenes/Dorso.webp"
    }
    else {
        foto.src = `Imagenes/Baraja/${carta.img}`
    }
    cartaHTML.dataset.numero = carta.numero
    cartaHTML.dataset.color = carta.color
    cartaHTML.dataset.tipo = carta.tipo

    cartaHTML.classList.add("carta")
    cartaHTML.appendChild(foto)
    cartaHTML.onclick = () => {
        comprobarClick(cartaHTML)
    }
    return cartaHTML
}

// Función para crear una carta "fantasma" cuando la columna está vacía
const crearCartaFantasma = (columnaIndex) => {
    const cartaFantasma = document.createElement("div");
    cartaFantasma.classList.add("carta");
    cartaFantasma.dataset.fantasma = true;
    cartaFantasma.dataset.pila = columnaIndex; // Asociamos la columna
    cartaFantasma.style.width = '100px'; // Añadimos un estilo visual (puedes ajustarlo)
    cartaFantasma.style.height = '140px';
    cartaFantasma.style.backgroundColor = 'transparent'; // Deja la carta invisible
    cartaFantasma.onclick = () => comprobarClick(cartaFantasma);
    return cartaFantasma;
};


const ponerCartasInicio = () => {

    for (let i = 0; i < mazoBarajado.length; i++) {
        const carta = mazoBarajado[i];
        const cartaHTML = crearCartaHTML(carta);
        inicial.appendChild(cartaHTML);
    }
}

const ponerCartasColumna = () => {
    for (let i = 0; i < columna.length; i++) {
        const pila = document.querySelector(`#pila-${i}`);
        pila.innerHTML = "";

        if (pila) {
            if (columna[i].length === 0) {
                // Crear carta fantasma si la columna está vacía
                const cartaFantasma = crearCartaFantasma(i);
                pila.appendChild(cartaFantasma);
            } else {
                for (let j = 0; j < columna[i].length; j++) {
                    const ultimaCartaPila = j === columna[i].length - 1;
                    const carta = columna[i][j];
                    if (ultimaCartaPila) {
                        carta.estaVolteada = false;
                    }
                    const cartaHTML = crearCartaHTML(carta);
                    cartaHTML.dataset.pila = i;
                    cartaHTML.style.top = `${j * 33}px`;
                    pila.appendChild(cartaHTML);
                }
            }
        } else {
            console.error(`No se encontró el elemento #pila-${i}`);
        }
    }
};

/*const comprobarClick = (carta) => {
    if (primerClick) {
        const segundoClick = carta;
        if (primerClick.dataset.numero == segundoClick.dataset.numero - 1 && segundoClick.dataset.color !== primerClick.dataset.color) {
            const pilaPrimeraCarta = columna[Number(primerClick.dataset.pila)]
            const pilaSegundoCarta = columna[Number(segundoClick.dataset.pila)]
            const primeraCartaObj = pilaPrimeraCarta.pop()
            pilaSegundoCarta.push(primeraCartaObj)
            ponerCartasColumna()
        }
        
        else {
            alert("no se puede realizar")
        }
        primerClick.style.border = "none";//
        primerClick = null;//

    }
    else {
        primerClick = carta
        carta.style.border = "2px solid red"
    }
}*/

/*const comprobarClick = (carta) => {//NUEVO FUNCIONA SIN MOVER REY PILA VACIA
    if (primerClick) {
        const segundoClick = carta;
        const pilaPrimeraCarta = columna[Number(primerClick.dataset.pila)];
        const pilaSegundoCarta = columna[Number(segundoClick.dataset.pila)];
        const indiceCartaSeleccionada = pilaPrimeraCarta.findIndex(c => c.numero == primerClick.dataset.numero && c.color == primerClick.dataset.color);
        
        if (
            indiceCartaSeleccionada !== -1 &&
            primerClick.dataset.numero == segundoClick.dataset.numero - 1 &&
            segundoClick.dataset.color !== primerClick.dataset.color
        ) {
            // Mover todas las cartas desde la seleccionada hasta la última
            const cartasAMover = pilaPrimeraCarta.splice(indiceCartaSeleccionada);
            pilaSegundoCarta.push(...cartasAMover);
            
            ponerCartasColumna();
        } else {
            alert("No se puede realizar el movimiento");
        }
        
        primerClick.style.border = "none";
        primerClick = null;
    } else {
        primerClick = carta;
        carta.style.border = "2px solid red";
    }
};*/

// Modificamos la lógica de comprobarClick para permitir el movimiento hacia columnas vacías
const comprobarClick = (carta) => {
    if (primerClick) {
        const segundoClick = carta;
        const pilaPrimeraCarta = columna[Number(primerClick.dataset.pila)];
        const pilaSegundoCarta = columna[Number(segundoClick.dataset.pila)];

        // Si el primerClick es una carta 13 y tiene cartas encima
        if (primerClick.dataset.numero == 13 && pilaPrimeraCarta.length > 1) {
            // Si el segundo click es sobre una columna vacía (carta fantasma)
            if (segundoClick.dataset.fantasma !== undefined) {
                // Mover toda la pila de cartas desde la carta 13 hasta la última carta en esa pila
                const cartasAMover = pilaPrimeraCarta.splice(pilaPrimeraCarta.findIndex(c => c.numero === 13)); // Eliminar desde el 13 hasta el final
                columna[Number(segundoClick.dataset.pila)].push(...cartasAMover); // Mover las cartas a la columna vacía

                ponerCartasColumna(); // Actualiza la visualización de las pilas
                primerClick.style.border = "none"; // Quita el borde
                primerClick = null; // Resetea primerClick
                return;  // Salir de la función
            }
        }

        // Verificamos el movimiento normal para las demás cartas
        const indiceCartaSeleccionada = pilaPrimeraCarta.findIndex(c => c.numero == primerClick.dataset.numero && c.color == primerClick.dataset.color);
        if (
            indiceCartaSeleccionada !== -1 &&
            primerClick.dataset.numero == segundoClick.dataset.numero - 1 &&
            segundoClick.dataset.color !== primerClick.dataset.color
        ) {
            // Mover todas las cartas desde la seleccionada hasta la última
            const cartasAMover = pilaPrimeraCarta.splice(indiceCartaSeleccionada);
            pilaSegundoCarta.push(...cartasAMover);
            ponerCartasColumna();
        } else {
            alert("No se puede realizar el movimiento");
        }

        primerClick.style.border = "none"; // Quitar el borde
        primerClick = null; // Resetea primerClick
    } else {
        primerClick = carta;
        carta.style.border = "2px solid red";
    }
};



if (botonEmpezar) {
    botonEmpezar.onclick = () => {

        // Reiniciar las variables antes de crear el mazo
        mazo = []
        mazoBarajado = []
        columna = []
        primerClick = null;

        // Volver a generar el mazo y repartir cartas
        crearMazo();
        barajarMazo();
        darCartas();
        ponerCartasColumna();
        ponerCartasInicio();





        // Limpiar la interfaz (opcional)
        /*inicial.innerHTML = ""
        for (let i = 0; i < 7; i++) {
            const pila = document.querySelector(`#pila-${i}`);
            if (pila) {
                pila.innerHTML = "";
            }
        }*/


    }
} else {
    console.error("No se encontró el botón con la clase .adelante");
}



