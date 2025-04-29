import PropTypes from "prop-types"

/**
 * @description Card volteable compuesta por una imagen al frente y una descripción al reverso.
 * 
 * @param {Object} `cardProps` - Objeto que representa los datos de la card.
 * @param {Object} `cardProps.icon` - Propiedades de la imagen de la card.
 * @param {string} `cardProps.icon.src` - Ruta de la imagen a mostrar en la card.
 * @param {string} `cardProps.icon.alt` - Texto a mostrar en el alt del img en la card.
 * @param {string} `cardProps.title` - Título mostrado al reverso de la card.
 * @param {string} `cardProps.brief` - Resumen mostrado al reverso de la card.
 * @param {string} `cardProps.description` - Descripción mostrada al hacer hover en la card.
 *
 * @example
 * const props = {
 *	       icon: { alt: 'icono', src: imageRoute },
 *	       title: 'Titulo de prueba',
 *	       brief: 'Resumen de prueba. Esto es una prueba de texto.',
 *	       description: 'Esta descripción solo se mostrará al hacer hover en la card',
 * }
 * 
 * return <FlipCard cardProps={props}>
 * 
 * @returns Card volteable con imagen y descripción.
 */
const FlipCard = ({cardProps}) => {
    return(
            <section 
                className="flip-card" 
                data-aos="fade-left" 
                data-aos-duration="1000" 
                title={cardProps.description || ""}
                >
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        {cardProps.icon &&
                            <img 
                                alt={cardProps.icon?.alt || "Icono"} 
                                className={"flip-icon"}
                                src={cardProps.icon?.src} 
                                />}
                    </div>
                
                    <div className="flip-card-back">
                        <h3 className="flip-card-title">
                            {cardProps.title || ""}
                        </h3>
                        
                        <p className="flip-card-brief">
                            {cardProps.brief}
                        </p>
                    </div>    
                </div>
            </section>
        )                                
}

FlipCard.propTypes = {
    cardProps: PropTypes.shape({
        icon: PropTypes.shape({
           src: PropTypes.string.isRequired,
           alt: PropTypes.string.isRequired
        }),
        title: PropTypes.string.isRequired,
        brief: PropTypes.string.isRequired,
        description: PropTypes.string
    })
}

export default FlipCard