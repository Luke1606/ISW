import React from "react"
import PropTypes from "prop-types"
import Error from "./Error"

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, message: "" }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: error.message }
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error capturado en ErrorBoundary:", error, errorInfo, errorInfo.componentStack)
    }

    render() {
        if (this.state.hasError) {
            return (
                <Error 
                    errorTitle="Algo salió mal"
                    errorDescription={this.state.message || "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde."} 
                />
            );
        }
        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ErrorBoundary