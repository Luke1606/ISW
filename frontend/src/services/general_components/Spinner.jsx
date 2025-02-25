import styled, { keyframes } from 'styled-components'

// Define la animación de rotación
const spin = keyframes`
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }`

// Crea un componente de spinner con estilos
const Spinner = styled.div`
    border: 4px solid rgba(255, 255, 255, 0.3)
    border-radius: 50%
    border-top: 4px solid #fff
    width: 40px
    height: 40px
    animation: ${spin} 1s linear infinite`

const LoadingSpinner = () => {
    return <Spinner />
};

export default LoadingSpinner