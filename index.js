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
const tablaEstadisticas = document.querySelector("#tabla-estadisticas");

// Verificar si el modal de estadísticas existe antes de agregar el evento

const cargarEstadisticas = () => {
    const xml = localStorage.getItem("EstadisticasXML");
    if (!xml) {
        console.warn("No hay datos en EstadisticasXML.");
        tablaEstadisticas.innerHTML = "<tr><td colspan='5'>No hay datos disponibles</td></tr>";
        return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const usuarios = xmlDoc.getElementsByTagName("usuario");

    // Limpiar la tabla antes de agregar nuevas filas
    tablaEstadisticas.innerHTML = "";

    // Verificar si hay usuarios en la base de datos
    if (usuarios.length === 0) {
        tablaEstadisticas.innerHTML = "<tr><td colspan='5'>No hay datos disponibles</td></tr>";
        return;
    }

    // Agregar filas a la tabla
    Array.from(usuarios).forEach(usuario => {
        const alias = usuario.getElementsByTagName("alias")[0]?.textContent || "N/A";
        const puntos = usuario.getElementsByTagName("puntos")[0]?.textContent || "0";
        const tiempo = usuario.getElementsByTagName("tiempo")[0]?.textContent || "0";
        const reinicio = usuario.getElementsByTagName("reinicio")[0]?.textContent || "0";
        const movimientos = usuario.getElementsByTagName("movimientos")[0]?.textContent || "0";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${alias}</td>
            <td>${puntos}</td>
            <td>${tiempo}</td>
            <td>${reinicio}</td>
            <td>${movimientos}</td>
        `;
        tablaEstadisticas.appendChild(fila);
    });
};

const usuariosModal = document.querySelector("#usuarios-modal");
const cerrarUsuarios = document.querySelector("#cerrar-usuarios");
const tablaUsuarios = document.querySelector("#tabla-usuarios");

const escalarVentana = (modal, tabla) => {
    const filas = tabla.querySelectorAll("tr").length;
    const alturaBase = 195; // Altura base del modal
    const alturaPorFila = 50; // Altura adicional por fila
    const nuevaAltura = Math.min(alturaBase + filas * alturaPorFila, 640); // Limitar la altura máxima

    modal.style.height = `${nuevaAltura}px`; // Ajustar la altura del modal
    modal.style.top = "20%"; // Mantener centrado verticalmente
    modal.style.transform = "translateY(-10%)"; // Ajustar para centrar
};

// Función para cargar usuarios y puntuaciones en el nuevo modal
const cargarUsuarios = () => {
    const xml = localStorage.getItem("EstadisticasXML");
    if (!xml) {
        console.warn("No hay datos en EstadisticasXML.");
        tablaUsuarios.innerHTML = "<tr><td colspan='2'>No hay datos disponibles</td></tr>";
        escalarVentana(usuariosModal, tablaUsuarios); // Escalar ventana
        return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const usuarios = xmlDoc.getElementsByTagName("usuario");

    // Limpiar la tabla antes de agregar nuevas filas
    tablaUsuarios.innerHTML = "";

    // Verificar si hay usuarios en la base de datos
    if (usuarios.length === 0) {
        tablaUsuarios.innerHTML = "<tr><td colspan='2'>No hay datos disponibles</td></tr>";
        escalarVentana(usuariosModal, tablaUsuarios); // Escalar ventana
        return;
    }

    // Agregar filas a la tabla
    Array.from(usuarios).forEach(usuario => {
        const alias = usuario.getElementsByTagName("alias")[0]?.textContent || "N/A";
        const puntos = usuario.getElementsByTagName("puntos")[0]?.textContent || "0";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${alias}</td>
            <td>${puntos}</td>
        `;
        fila.onclick = () => {
            cargarEstadisticasUsuario(alias); // Cargar estadísticas del usuario seleccionado
            usuariosModal.close();
            estadisticasModal.showModal();
        };
        tablaUsuarios.appendChild(fila);
    });

    escalarVentana(usuariosModal, tablaUsuarios); // Escalar ventana
};

// Función para cargar estadísticas de un usuario específico
const cargarEstadisticasUsuario = (aliasSeleccionado) => {
    const xml = localStorage.getItem("RegistrosXML"); // Cambiar a RegistrosXML
    if (!xml) {
        console.warn("No hay datos en RegistrosXML.");
        tablaEstadisticas.innerHTML = "<tr><td colspan='6'>No hay datos disponibles</td></tr>";
        escalarVentana(estadisticasModal, tablaEstadisticas); // Escalar ventana
        return;
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const usuarios = xmlDoc.getElementsByTagName("usuario");

    // Limpiar la tabla antes de agregar nuevas filas
    tablaEstadisticas.innerHTML = "";

    // Buscar el usuario seleccionado
    const usuario = Array.from(usuarios).find(
        usuario => usuario.getElementsByTagName("alias")[0]?.textContent === aliasSeleccionado
    );

    if (!usuario) {
        tablaEstadisticas.innerHTML = "<tr><td colspan='6'>No hay datos disponibles</td></tr>";
        escalarVentana(estadisticasModal, tablaEstadisticas); // Escalar ventana
        return;
    }

    // Actualizar el título del modal con el alias del usuario
    const estadisticasTitulo = document.querySelector("#estadisticas-modal h1");
    if (estadisticasTitulo) {
        estadisticasTitulo.textContent = `Estadísticas del usuario: ${aliasSeleccionado}`;
    }

    // Agregar filas con las estadísticas del usuario
    const estadisticas = usuario.getElementsByTagName("estadistica");
    Array.from(estadisticas).forEach(estadistica => {
        const fecha = estadistica.getElementsByTagName("fecha")[0]?.textContent || "N/A";
        const hora = estadistica.getElementsByTagName("hora")[0]?.textContent || "N/A";
        const puntos = estadistica.getElementsByTagName("puntos")[0]?.textContent || "0";
        const tiempo = estadistica.getElementsByTagName("tiempo")[0]?.textContent || "0";
        const reinicio = estadistica.getElementsByTagName("reinicio")[0]?.textContent || "0";
        const movimientos = estadistica.getElementsByTagName("movimientos")[0]?.textContent || "0";

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>${puntos}</td>
            <td>${tiempo}</td>
            <td>${reinicio}</td>
            <td>${movimientos}</td>
        `;
        tablaEstadisticas.appendChild(fila);
    });

    escalarVentana(estadisticasModal, tablaEstadisticas); // Escalar ventana
};

// Llamar a cargarEstadisticas al abrir el modal de estadísticas
if (inicio1) {
    inicio1.onclick = () => {
        cargarUsuarios(); // Cargar datos en la tabla de usuarios
        usuariosModal.showModal();
    };
}

if (cerrarEstadisticas) {
    cerrarEstadisticas.onclick = () => {
        estadisticasModal.close(); // Cerrar el modal de estadísticas
        usuariosModal.showModal(); // Volver a abrir el modal de usuarios
    };
}

// Cerrar el modal de usuarios
if (cerrarUsuarios) {
    cerrarUsuarios.onclick = () => {
        usuariosModal.close();
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