//Son los onclick de los botones que hay en las secciones
const inicio = document.querySelector(".inicio");
if (inicio) {
    inicio.onclick = () => {
        window.location.href = "Principal.html";
    };
}
else {
    console.error("No se encontró el botón con la clase .adelante");
}

const inicio1 = document.querySelector(".inicio1");
const estadisticasModal = document.querySelector("#estadisticas-modal");
const cerrarEstadisticas = document.querySelector("#cerrar-estadisticas");

if (inicio1) {
    inicio1.onclick = () => {
        estadisticasModal.showModal();
    };
}

if (cerrarEstadisticas) {
    cerrarEstadisticas.onclick = () => {
        estadisticasModal.close();
    };
}

const inicio2 = document.querySelector(".inicio2");
if (inicio2) {
    inicio2.onclick = () => {
        window.location.href = "https://www.solitaire365.com/es/estrategias/historia-del-solitario";
    };
}
else {
    console.error("No se encontró el botón con la clase .adelante");
}

const inicio3 = document.querySelector(".inicio3");
if (inicio3) {
    inicio3.onclick = () => {
        window.location.href = "https://javierneilabarajas.blogspot.com/2013/04/palos-de-la-baraja-francesa.html";
    };
}
else {
    console.error("No se encontró el botón con la clase .adelante");
}

//Script para hacer que las cartas se puedas trasladar hacia arriba cuando hacemos un click
document.addEventListener('DOMContentLoaded', function () {
    const cartas = document.querySelectorAll('.menu img');
    let selectedCarta = null;

    cartas.forEach(carta => {
        carta.addEventListener('click', function () {
            if (this.classList.contains('menu-selected')) {
                this.classList.remove('menu-selected');
                selectedCarta = null;
                // Referencia a una sección distinta
                const sectionNumber = this.getAttribute('data-section');
                const section = document.querySelector(`.contenedor section:nth-child(${sectionNumber})`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                cartas.forEach(innerCarta => innerCarta.classList.remove('menu-selected'));
                this.classList.add('menu-selected');
                selectedCarta = this;
            }
        });

        //Función para que detecte un segundo click y vaya a la sección correspondiente
        carta.addEventListener('dblclick', function () {
            if (selectedCarta === this) {
                // Referencia a una sección distinta
                const sectionNumber = this.getAttribute('data-section');
                const section = document.querySelector(`.contenedor section:nth-child(${sectionNumber})`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});