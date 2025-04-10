import PropTypes from 'prop-types'
import { createContext, useState } from 'react'

const LoadingContext = createContext()

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