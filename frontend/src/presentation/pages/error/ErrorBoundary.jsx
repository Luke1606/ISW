import React from 'react'
import PropTypes from 'prop-types'
import { Error } from './'

/**
 * @description Clase interceptora de todo error ocurrido en la aplicación. Busca captar los errores y 
 * renderizarlos en el componente {@link Error}.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, message: '' }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: error.message }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error capturado en ErrorBoundary:', error, errorInfo)
        
        if (error.message.includes('navigation')) {
            console.warn('Error relacionado con React Router detectado.')
        }
    }
    

    render() {
        if (this.state.hasError) {
            const isNetworkError = this.state.message.includes('HTTP Error')
            return (
                <Error
                    errorTitle={isNetworkError ? 'Error de red' : 'Algo salió mal'}
                    errorDescription={this.state.message || 'Ha ocurrido un error inesperado.'}
                />
            )
        }
        return this.props.children
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ErrorBoundary