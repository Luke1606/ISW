import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import FlipCard from "./FlipCard"
import PaginationButtons from "./PaginationButtons"

export const CardCarousel = ({ elements }) => {
	const [isHovering, setIsHovering] = useState(false)

	const [ currentElement, setCurrentElement ] = useState(0)
    
    const handleElementChange = (newElement) => {
        setCurrentElement(newElement)
    }

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
	}, [elements.length, currentElement, isHovering])

 	const paginationParams = {
		totalPages: elements.length,
      	currentPage: currentElement,
      	handlePageChange: handleElementChange,
		pageControl: false,
		loop: true
  	}

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
			icon: PropTypes.object.isRequired,
			title: PropTypes.string.isRequired,
			brief: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
		})
	)
}