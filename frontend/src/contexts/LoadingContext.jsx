import PropTypes from 'prop-types'
import { createContext, useState } from 'react'

/**
 * @description Contexto diseñado para manejo centralizado de estados de carga.
 */
const LoadingContext = createContext()

/**
 * @description Provider diseñado para manejo del {@link LoadingContext}
 * @param {React.ReactNode} children
 * @returns Provider que permite a los componentes hijos acceder al estado {@link loading} y la función de manejo {@link setLoading}.
 */
const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

LoadingProvider.propTypes = {
    children: PropTypes.node,
}

export { LoadingContext, LoadingProvider }