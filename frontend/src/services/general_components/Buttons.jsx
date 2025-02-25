import PropTypes from 'prop-types'

const styles = {
    default : {
        cursor: "pointer", 
        padding : "5px",
        margin : "5px",
    },
    accept : {
        
    },
    cancel : {
    }
}

const allPropTypes = {
    default : {
        style: PropTypes.object,
        onClick: PropTypes.func,
        children: PropTypes.node,
        type: PropTypes.string,
        
    },
    custom : {
        customStyles: PropTypes.object,
        content: PropTypes.string,
    }
}

// Componente base para botones
const BaseButton = ({ type="button", style={}, onClick, children }) => {
    const combinedStyles = { ...styles.default, ...style}
    

    return (
        <button type={type} style={combinedStyles} 
            onClick={onClick}
            >
            {children}
        </button>
    )
}

BaseButton.propTypes = allPropTypes.default

// Personalizado
const CustomButton = ({ customStyles = {}, children, onClick }) => {
    return <BaseButton style={customStyles} onClick={onClick}> {children} </BaseButton>
}

CustomButton.propTypes = {...allPropTypes.custom, ...allPropTypes.default}

// Aceptar
const AcceptButton = () => 
    <BaseButton type="submit" styles={styles.accept}> Aceptar </BaseButton>


// Cancelar
const CancelButton = ({ onClick }) => 
    <BaseButton type="submit" styles={styles.cancel} onClick={onClick}> Cancelar </BaseButton>


CancelButton.propTypes = allPropTypes.default.onClick

export { BaseButton, AcceptButton, CancelButton, CustomButton }