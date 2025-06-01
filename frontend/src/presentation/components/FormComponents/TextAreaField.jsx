import PropTypes from 'prop-types'

const TextAreaField = ({ id, placeholder, formikProps }) => {
    return (
        <textarea
            className='form-input'
            id={id}
            rows='4'
            placeholder={placeholder}
            onInput={(e) => {
                e.target.style.height = "auto" // Reinicia la altura antes de calcular
                e.target.style.height = `${Math.min(e.target.scrollHeight, 320)}px` // Ajusta hasta el máximo permitido
            }}                    
            {...formikProps}
            />
        )
}

TextAreaField.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    formikProps: PropTypes.object.isRequired,
}

export default TextAreaField