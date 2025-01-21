document.addEventListener("DOMContentLoaded", function () {
    // Selecciona todos los botones dropdown
	const dropdownBtns = document.querySelectorAll(".dropdown-btn");

	// -------------EVENTO CLIC A CADA BOTÓN------------------
	dropdownBtns.forEach((btn) => {
		btn.addEventListener("click", function (event) {
			// Evitamos que el evento le afecte a los padres
			event.stopPropagation();
            event.preventDefault();
			// Encontrar el contenido dropdown más cercano
			const dropdown = this.closest(".dropdown");

			// Cerrar todos los dropdowns antes de abrir el seleccionado
			const dropdowns = document.querySelectorAll(".dropdown");
			dropdowns.forEach((dropdownItem) => {
				if (dropdownItem !== dropdown) {
                    // Cierra otros dropdowns
					dropdownItem.classList.remove("active");
				}
			});

			// Alternar el estado de visibilidad del dropdown clickeado
			dropdown.classList.toggle("active");
		});
	});

	// ------------CIERRA DROPDOWNS AL CLICAR FUERA-----------
	document.addEventListener("click", function (event) {
        if (!event.target.closest('.dropdown')) {
            const dropdowns = document.querySelectorAll(".dropdown");
            dropdowns.forEach((dropdown) => {
                dropdown.classList.remove("active");
            });
        }
    });

    // -------GUARDAR PRODUCTOS SELECCIONADOS EN LA LISTA--------
    const generarListaBtn = document.getElementById("generar-lista");
    if (generarListaBtn) {
        generarListaBtn.addEventListener("click", function () {
            const checkboxes = document.querySelectorAll(".producto");
            const productosSeleccionados = [];

            //Añade productos al array vacío
            checkboxes.forEach(function (checkbox) {
                if (checkbox.checked) {
                    productosSeleccionados.push(checkbox.value);
                }
            });

            //En el localstorage se guarda la lista y aparece mensaje tanto si se selecciona un producto como si no
            if (productosSeleccionados.length > 0) {
                localStorage.setItem("productosSeleccionados", JSON.stringify(productosSeleccionados));
                alert("Lista generada con éxito.");
            } else {
                alert("Selecciona al menos un producto.");
            }
        });
    }

    // ---PRODUCTOS SELECCIONADOS DESDE LOCALSTORAGE----
    // Primero seleccionamos el elemento ul donde mostraremos los productos
    const listaProductosElement = document.querySelector('.lista-productos');
    const borrarListaBtn = document.querySelector(".borrar-lista");

    // Solo ejecutar este código si estamos en la página de lista de productos
    if (listaProductosElement) {

        // Función para actualizar la lista
        function mostrarProductos() {
            listaProductosElement.innerHTML = ''; // Limpiar la lista

            let productos = [];
            try {
                const stored = localStorage.getItem("productosSeleccionados");
                if (stored) {
                    productos = JSON.parse(stored);
                }
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }

            //Crear li para cada producto que se añade
            if (productos && productos.length > 0) {
                productos.forEach(function (producto) {
                    const li = document.createElement("li");
                    li.textContent = producto;
                    listaProductosElement.appendChild(li);
                });
            } else {
                const li = document.createElement("li");
                li.textContent = "No se han seleccionado productos.";
                listaProductosElement.appendChild(li);
            }
        }

        // Mostrar productos al cargar la página
        mostrarProductos();

        // ------------------BORRAR LA LISTA------------------
        if (borrarListaBtn) {
            borrarListaBtn.addEventListener("click", function () {
                localStorage.removeItem("productosSeleccionados");
                // Actualizar la lista después de borrar
                mostrarProductos();
            });
        }
    }
});