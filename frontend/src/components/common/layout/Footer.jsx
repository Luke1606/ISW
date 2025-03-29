import { Link } from "react-router-dom"
import Modal from '../Modal'
import { useDropPopup } from "../../../hooks/common/usePopup"

const Footer = () => {
    const popupId = 'footer-popup'
    const {
        openerRef,
        dropPopupRef,
        isVisible,
        toggleVisible
    } = useDropPopup(popupId)

    return (
        <footer className="footer">
            <small className="footer-content">
                Universidad de las Ciencias Informáticas. XAUCE. Akademos © 2011-2020
            </small>

            <button 
                className="footer-button" 
                title="Mostrar redes sociales"
                onClick={toggleVisible} 
                data-popup-id={popupId}
                ref={openerRef}
                >
                <img className="footer-icon" src="/arrow.gif" alt="Abrir menú" />
            </button>

            <Modal
                isOpen={isVisible}
                position='bottom-right'>
                <div 
                    className="social-icons menu-dropdown" 
                    data-popup-id={popupId}
                    ref={dropPopupRef} 
                    >
                    <Link 
                        title="Facebook"
                        to="#" 
                        className="social-icon fab"
                        >
                        <img src="/facebook.png" className="social facebook" />
                    </Link>
                    <Link 
                        title="X"
                        to="#" 
                        className="social-icon x"
                        >
                        <img src="/x.png" className="social x" />
                    </Link>
                    <Link 
                        title="Whatsapp"
                        to="#" 
                        className="social-icon what"
                        >
                        <img src="/whatsapp.png" className="social whatsapp" />
                    </Link>
                    <Link 
                        title="LinkedIn"
                        to="#" 
                        className="social-icon link"
                        >
                        <img src="/linkedin.png" className="social linkedin" />
                    </Link>
                    <Link 
                        title="Instagram"
                        to="#" 
                        className="social-icon inst"
                        >
                        <img src="/instagram.png" className="social instagram" />
                    </Link>
                    <Link 
                        title="Telegram"
                        to="#" 
                        className="social-icon tel"
                        >
                        <img src="/telegram.png" className="social telegram" />
                    </Link>
                </div>
            </Modal>
        </footer>
    )
}

export default Footer
