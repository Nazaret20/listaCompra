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
		if (!event.target.closest(".dropdown")) {
			const dropdowns = document.querySelectorAll(".dropdown");
			dropdowns.forEach((dropdown) => {
				dropdown.classList.remove("active");
			});
		}
	});

	// -------GUARDAR PRODUCTOS SELECCIONADOS EN LA LISTA--------
	const generarListaBtn = document.getElementById("generar-lista");
	const añadirProductosBtn = document.getElementById("añadir-productos");

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

	// Nuevo botón para añadir productos
	if (añadirProductosBtn) {
		añadirProductosBtn.addEventListener("click", function () {
			const checkboxes = document.querySelectorAll(".producto");

			// Obtener productos existentes del localStorage
			let existingProducts = [];
			try {
				const stored = localStorage.getItem("productosSeleccionados");
				if (stored) {
					existingProducts = JSON.parse(stored);
				}
			} catch (error) {
				console.error("Error al cargar productos existentes:", error);
			}

			// Añade productos al array
			checkboxes.forEach(function (checkbox) {
				if (checkbox.checked) {
					// Solo añadir si el producto no está ya en la lista
					if (!existingProducts.includes(checkbox.value)) {
						existingProducts.push(checkbox.value);
					}
				}
			});

			// Guardar lista actualizada
			if (existingProducts.length > 0) {
				localStorage.setItem("productosSeleccionados", JSON.stringify(existingProducts));
				alert("Productos añadidos con éxito.");
			} else {
				alert("Selecciona al menos un producto nuevo.");
			}
		});
	}

	// ---PRODUCTOS SELECCIONADOS DESDE LOCALSTORAGE----
	// Primero seleccionamos el elemento ul donde mostraremos los productos
	const listaProductosElement = document.querySelector(".lista-productos");

	// Solo ejecutar este código si estamos en la página de lista de productos
	if (listaProductosElement) {
		// Delegación de eventos en el ul padre
		listaProductosElement.addEventListener("click", function (event) {
			// Encontrar el li más cercano al elemento clickeado
			const li = event.target.closest("li");

			// Si no se encontró un li o es el mensaje de "no hay productos", salir
			if (!li || !li.querySelector(".producto-item")) return;

			// Obtener los elementos relevantes
			const checkbox = li.querySelector("input[type='checkbox']");
			const textoProducto = li.querySelector("span");
			const producto = textoProducto.textContent;

			// Toggle del estado
			let productosComprados = [];
			try {
				const stored = localStorage.getItem("productosComprados");
				if (stored) {
					productosComprados = JSON.parse(stored);
				}
			} catch (error) {
				console.error("Error al cargar productos comprados:", error);
			}

			// Si el click fue directamente en el checkbox, no necesitamos cambiarlo
			if (event.target.type !== "checkbox") {
				checkbox.checked = !checkbox.checked;
			}

			if (checkbox.checked) {
				if (!productosComprados.includes(producto)) {
					productosComprados.push(producto);
				}
				textoProducto.style.textDecoration = "line-through";
				textoProducto.style.color = "#888";
			} else {
				const index = productosComprados.indexOf(producto);
				if (index > -1) {
					productosComprados.splice(index, 1);
				}
				textoProducto.style.textDecoration = "none";
				textoProducto.style.color = "";
			}

			localStorage.setItem("productosComprados", JSON.stringify(productosComprados));
		});

		function mostrarProductos() {
			listaProductosElement.innerHTML = "";

			let productos = [];
			let productosComprados = [];
			try {
				const stored = localStorage.getItem("productosSeleccionados");
				const storedComprados = localStorage.getItem("productosComprados");
				if (stored) {
					productos = JSON.parse(stored);
				}
				if (storedComprados) {
					productosComprados = JSON.parse(storedComprados);
				}
			} catch (error) {
				console.error("Error al cargar productos:", error);
			}

			if (productos && productos.length > 0) {
				productos.forEach(function (producto) {
					const li = document.createElement("li");
					li.style.cursor = "pointer"; // Hacer todo el li clicable

					const productoContainer = document.createElement("div");
					productoContainer.className = "producto-item";
					productoContainer.style.display = "flex";
					productoContainer.style.alignItems = "center";
					productoContainer.style.gap = "10px";

					const checkbox = document.createElement("input");
					checkbox.type = "checkbox";
					checkbox.checked = productosComprados.includes(producto);

					const textoProducto = document.createElement("span");
					textoProducto.textContent = producto;

					if (productosComprados.includes(producto)) {
						textoProducto.style.textDecoration = "line-through";
						textoProducto.style.color = "#888";
					}

					productoContainer.appendChild(checkbox);
					productoContainer.appendChild(textoProducto);
					li.appendChild(productoContainer);
					listaProductosElement.appendChild(li);
				});
			} else {
				const li = document.createElement("li");
				li.textContent = "No se han seleccionado productos.";
				listaProductosElement.appendChild(li);
			}
		}

		mostrarProductos();

		// ------------------BORRAR LA LISTA------------------
		const borrarListaBtn = document.querySelector(".borrar-lista");
		if (borrarListaBtn) {
			borrarListaBtn.addEventListener("click", function () {
				localStorage.removeItem("productosSeleccionados");
				localStorage.removeItem("productosComprados"); // Borrar también los productos comprados
				mostrarProductos();
			});
		}
	}

	//-----------------BUSCADOR DE PRODUCTOS-------------------
	const buscador = document.getElementById("buscador");
	const resultadosContainer = document.getElementById("resultados-busqueda");

	// Función para normalizar texto (quitar tildes y convertir a minúsculas)
	const normalizeText = (text) => {
		return text
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "");
	};

	const productos = Array.from(document.querySelectorAll(".dropdown-content label")).map((label) => ({
		nombre: label.textContent.trim(),
		elemento: label,
	}));

	buscador.addEventListener("input", function (e) {
		const busqueda = normalizeText(e.target.value.trim());

		if (busqueda === "") {
			resultadosContainer.style.display = "none";
			return;
		}

		const resultados = productos.filter((producto) => normalizeText(producto.nombre).includes(busqueda));

		if (resultados.length > 0) {
			resultadosContainer.innerHTML = "";
			resultados.forEach((producto) => {
				const div = document.createElement("div");
				div.className = "resultado-item";
				div.textContent = producto.nombre;

				div.addEventListener("click", () => {
					// Buscar el dropdown padre
					const label = producto.elemento;
					const dropdown = label.closest(".dropdown");

					// Primero cerrar todos los dropdowns
					document.querySelectorAll(".dropdown").forEach((d) => {
						d.classList.remove("active");
					});

					// Dar tiempo al DOM para actualizar
					setTimeout(() => {
						// Abrir el dropdown específico
						dropdown.classList.add("active");

						// Scroll suave después de abrir el dropdown
						setTimeout(() => {
							label.scrollIntoView({
								behavior: "smooth",
								block: "center",
							});
						}, 100);
					}, 0);

					// Limpiar búsqueda
					buscador.value = "";
					resultadosContainer.style.display = "none";
				});

				resultadosContainer.appendChild(div);
			});
			resultadosContainer.style.display = "block";
		} else {
			resultadosContainer.innerHTML = '<div class="resultado-item">No se encontraron productos</div>';
			resultadosContainer.style.display = "block";
		}
	});

	// Cerrar resultados al hacer clic fuera
	document.addEventListener("click", function (e) {
		if (!buscador.contains(e.target) && !resultadosContainer.contains(e.target)) {
			resultadosContainer.style.display = "none";
		}
	});
});
