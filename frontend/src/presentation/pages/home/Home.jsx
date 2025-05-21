import { useNavigate } from 'react-router-dom'
import { useAuth, useModal } from '@/logic'
import { datatypes, featureItems } from '@/data/'
import { LoginForm, Modal, CardCarousel } from '@/presentation'

/**
 * @description Componente que renderiza la página principal de la aplicación.
 * @returns Componente principal compuesto por un hero que que contiene un mensaje de bienvenida (variante dependiendo del usuario autenticado, si hay uno) y un carousel de características del sistema y el botón `acceder/comenzar` para autenticarse.
 */
const Home = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    /**
     * @description Id asociado al modal encargado de renderizar el {@link LoginForm}, se utiliza en las funciones `openModal`, `isOpen` y `closeModal`.
     */
	const modalId = 'loginForm-modal'
	const { isOpen, openModal, closeModal } = useModal()

    const closeFunc = () => {
        closeModal(modalId)
    }

    /**
     * Función a ejecutar cuando se toque en el botón `acceder/comenzar` dependiendo del rol del usuario autenticado, si hay uno, ya sea navegar a la página de gestión o abrir el modal de login. 
     */
	const accessFunction = () => {
		if (user) {
			switch (user?.user_role) {
				case datatypes.user.student:
					navigate(`/list/${datatypes.evidence}/${user.id}/`)
					break
				case datatypes.user.professor:
					navigate(`/list/${datatypes.user.student}/${user.id}`)
					break
				default:
					navigate(`/list/${datatypes.user.defaultUser}/`)
					break
			}
		} else
			openModal(modalId)
	}
    
    const welcomeMessage = `Bienvenido(a) ${user? user.name : 'al Sistema de Gestión de Ejercicios de Culminación de Estudios'}`
    const startButtonMessage = user? 'Comenzar' : 'Acceder'
    
    return (
        <>
            <section className='home-hero'>
                <div className='home-hero-text'>
                    <h2 className='home-hero-title'>
                        {welcomeMessage}
                    </h2>

                    <p className='home-hero-content'>
                        Una solución integral para la gestión de todo el proceso de ejercicios de culminación de estudios integrada con una herramienta multiplataforma que contribuye al perfeccionamiento de los procesos académicos de una institución.
                    </p>
                </div>
                
                <CardCarousel elements={featureItems}/>
            </section>
            
            <button 
                className='home-button'
                onClick={accessFunction}
                >
                {startButtonMessage}
            </button>

			<Modal isOpen={isOpen(modalId)}>
				<LoginForm closeFunc={closeFunc} />
			</Modal>
        </>
    )
}

export default Home