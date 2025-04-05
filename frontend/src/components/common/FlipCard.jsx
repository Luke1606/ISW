import PropTypes from "prop-types"

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
        icon: PropTypes.object,
        title: PropTypes.string,
        brief: PropTypes.string.isRequired,
        description: PropTypes.string
    })
}

export default FlipCard