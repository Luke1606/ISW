import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/Auth/useAuth'
import { useModal } from '../../hooks/common/useContexts'
import Modal from '../common/Modal'
import CardCarousel from '../common/CardCarousel'
import LoginForm from './LoginForm'
import datatypes from '../../consts/datatypes'
import featureItems from '../../consts/featureItems'

const HomeComponent = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
	const modalId = 'loginForm-modal'
	const { isOpen, openModal, closeModal } = useModal()

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
					navigate(`/list/${datatypes.user.student}/`)
					break
			}
		} else
			openModal(modalId)
	}
    
    const welcomeMessage = `Bienvenido ${user? user.name : 'al Sistema de Gestión de Ejercicios de Culminación de Estudios'}`
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
				<LoginForm modalId={modalId} closeModal={closeModal} />
			</Modal>
        </>
    )
}

export default HomeComponent