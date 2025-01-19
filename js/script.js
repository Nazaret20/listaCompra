document.addEventListener("DOMContentLoaded", function () {
	// Seleccionar todos los botones dropdown
	const dropdownBtns = document.querySelectorAll(".dropdown-btn");

	// Agregar evento click a cada botón
	dropdownBtns.forEach((btn) => {
		btn.addEventListener("click", function (event) {
			// Prevenir que el click se propague al documento
			event.stopPropagation();
			// Encontrar el contenido dropdown más cercano
			const dropdown = this.closest(".dropdown");
			dropdown.classList.toggle("active");
		});
	});

	// Cerrar dropdowns cuando se hace clic fuera
	document.addEventListener("click", function (event) {
		const dropdowns = document.querySelectorAll(".dropdown");
		dropdowns.forEach((dropdown) => {
			if (!dropdown.contains(event.target)) {
				dropdown.classList.remove("active");
			}
		});
	});

	// Función para guardar los productos seleccionados
	document.getElementById("generar-lista").addEventListener("click", function () {
		const checkboxes = document.querySelectorAll(".producto");
		const productosSeleccionados = [];

		checkboxes.forEach(function (checkbox) {
			if (checkbox.checked) {
				productosSeleccionados.push(checkbox.value);
			}
		});

		if (productosSeleccionados.length > 0) {
			localStorage.setItem("productosSeleccionados", JSON.stringify(productosSeleccionados));
			alert("Lista generada con éxito.");
		} else {
			alert("Selecciona al menos un producto.");
		}
	});
});
