import { useState, useEffect, useMemo } from "react"
import PropTypes from 'prop-types'
import FlipCard from './FlipCard'
import { PaginationButtons } from '../'

/**
 * @description Componente carousel con: 
 * - Conjunto de {@link FlipCard} compuestas por una imagen al frente y un texto descriptivo al reverso renderizadas a partir de {@link elements}.
 * - Botones de paginación ({@link PaginationButtons}) sincronizados con las cards.
 *
 * @param {Array<Object>} `elements` - Arreglo de objetos que representan los datos de las cards en el carousel.
 * @param {Object} `elements[].icon` - Propiedades de la imagen de la card.
 * @param {string} `elements[].icon.src` - Ruta de la imagen a mostrar en la card
 * @param {string} `elements[].icon.alt` - Texto a mostrar en el alt del img en la card
 * @param {string} `elements[].title` - Título mostrado al reverso de la card.
 * @param {string} `elements[].brief` - Resumen mostrado al reverso de la card.
 * @param {string} `elements[].description` - Descripción mostrada al hacer hover en la card.
 *
 * @example 
 * const cardtems = [
 *     {
 *	       icon: { alt: 'icono', src: imageRoute },
 *	       title: 'Titulo de prueba',
 *	       brief: 'Resumen de prueba. Esto es una prueba de texto.',
 *	       description: 'Esta descripción solo se mostrará al hacer hover en la card',
 *	   }
 * ]
 * 
 * return <CardCarousel elements={cardItems}>
 * 
 * @returns Componente carousel con cards cambiantes y botones de paginación.
 */
const CardCarousel = ({ elements }) => {
	const [isHovering, setIsHovering] = useState(false)

	const [ currentElement, setCurrentElement ] = useState(0)
    
    const handleElementChange = (newElement) => {
        setCurrentElement(newElement)
    }

	const totalElements = useMemo(() => elements.length, [elements])
	
	useEffect(() => {
		let interval
		if (!isHovering)
			interval = setInterval(
				() => handleElementChange(currentElement == elements.length-1? 0 : currentElement+1)
				, 5000
			)

		return () => {
			if (interval) clearInterval(interval)
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [totalElements, currentElement, isHovering])

	if (!elements || totalElements === 0) {
		return <div>No hay elementos disponibles</div>;
	}
	
	/**
	 * @description Props destinadas a enviar a {@link PaginationButtons}
	 */
 	const paginationParams = {
		totalPages: totalElements,
      	currentPage: currentElement,
      	handlePageChange: handleElementChange,
		pageControl: false,
		loop: true
  	}
    /**
	 * @description Props destinadas a enviar a cada {@link FlipCard}
	 */
	const cardProps = {
		icon: elements[currentElement]?.icon,
		title: elements[currentElement]?.title,
		brief: elements[currentElement]?.brief,
		description: elements[currentElement]?.description,
	}

	return (
		<div 
			className="card-carousel"
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			>
			<div className="carousel-container">
				<div className="carousel-slide">
					<FlipCard cardProps={cardProps}/>
				</div>

				<PaginationButtons paginationParams={paginationParams} optionalButtonClassName="carousel-button"/>
			</div>
		</div>
	)
}

CardCarousel.propTypes = {
	elements: PropTypes.arrayOf(
		PropTypes.shape({
			icon: PropTypes.shape({
				src: PropTypes.string.isRequired,
				alt: PropTypes.string.isRequired
			}),
			title: PropTypes.string.isRequired,
			brief: PropTypes.string.isRequired,
			description: PropTypes.string
		})
	)
}

export default CardCarousel