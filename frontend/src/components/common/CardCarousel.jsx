// Importación de hooks y módulos necesarios de React
import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Para la validación de tipos de propiedades
import FlipCard from "./FlipCard"; // Componente de tarjeta animada
import PaginationButtons from "./PaginationButtons"; // Componente de paginación

/**
 * CardCarousel - Un componente de carrusel interactivo que rota automáticamente entre un conjunto de elementos.
 * @param {Array} elements - Array de objetos que representan los datos de cada tarjeta en el carrusel.
 */
const CardCarousel = ({ elements }) => {
  // Estado para controlar si el ratón está sobre el carrusel
	const [isHovering, setIsHovering] = useState(false);
  // Estado para rastrear el índice del elemento actual que se muestra
	const [currentElement, setCurrentElement] = useState(0);

	/**
   * handleElementChange - Cambia el elemento actual mostrado.
   * @param {number} newElement - Índice del nuevo elemento.
   */
	const handleElementChange = (newElement) => {
    setCurrentElement(newElement);
	};

  // useEffect para manejar la rotación automática de los elementos
	useEffect(() => {
		let interval;
		if (!isHovering) {
			// Configura un intervalo para cambiar automáticamente los elementos cada 5 segundos
			interval = setInterval(() => {
			handleElementChange(currentElement === elements.length - 1 ? 0 : currentElement + 1);
			}, 5000);
		}

		// Limpia el intervalo al desmontar el componente
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [elements.length, currentElement, isHovering]);

  // Parámetros de configuración para el componente de paginación
	const paginationParams = {
		totalPages: elements.length,
		currentPage: currentElement,
		handlePageChange: handleElementChange,
		pageControl: false,
		loop: true,
	};

  	// Propiedades para el componente FlipCard
	const cardProps = {
		icon: elements[currentElement]?.icon,
		title: elements[currentElement]?.title,
		brief: elements[currentElement]?.brief,
		description: elements[currentElement]?.description,
	};

	return (
		<div
			className="card-carousel"
			onMouseEnter={() => setIsHovering(true)} // Habilita el estado de "hover" al entrar con el mouse
			onMouseLeave={() => setIsHovering(false)} // Desactiva el estado de "hover" al salir con el mouse
		>
			<div className="carousel-container">
			<div className="carousel-slide">
			<FlipCard cardProps={cardProps} /> {/* Renderiza la tarjeta animada */}
		</div>
		<PaginationButtons
			paginationParams={paginationParams}
			optionalButtonClassName="carousel-button"
			/> {/* Renderiza los botones de paginación */}
		</div>
		</div>
	);
};

// Validación de tipos de propiedades con PropTypes
CardCarousel.propTypes = {
	elements: PropTypes.arrayOf(
		PropTypes.shape({
			icon: PropTypes.object.isRequired, // Icono del elemento
			title: PropTypes.string.isRequired, // Título del elemento
			brief: PropTypes.string.isRequired, // Resumen del elemento
			description: PropTypes.string.isRequired, // Descripción completa del elemento
		})
	).isRequired,
};

// Exportación del componente CardCarousel
export default CardCarousel;