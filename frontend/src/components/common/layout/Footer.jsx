import { useState, useRef, useEffect } from 'react'
import { Link } from "react-router-dom"
import Modal from '../Modal'
import arrow from "/arrow.gif"
import facebook from "/facebook.png"
import instagram from "/instagram.png"
import whatsapp from "/whatsapp.png"
import x from "/x.png"
import linkedin from "/linkedin.png"

const Footer = () => {
    const [isMenuVisible, setMenuVisible] = useState(false)
    const menuRef = useRef(null)
    const buttonRef = useRef(null)

    const toggleMenu = () => {
        setMenuVisible(prevState => !prevState)
    }

    const handleClickOutside = (event) => {
        // Si se hace clic fuera del menú desplegable, se cierra
        if (
            menuRef.current && 
            !menuRef.current.contains(event.target) && // El clic no ocurrió dentro del menú
            buttonRef.current && 
            !buttonRef.current.contains(event.target) // El clic tampoco ocurrió dentro del botón
        ) {
            setMenuVisible(false)
        }
    }

    useEffect(() => {
        // Añadir el listener cuando se monte el componente
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            // Limpiar el listener cuando se desmonte el componente
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <footer className="footer">
            <small className="footer-content">
                Universidad de las Ciencias Informáticas. XAUCE. Akademos © 2011-2020
            </small>

            <button className="footer-button" onClick={toggleMenu} ref={buttonRef}>
                <img className="footer-icon" src={arrow} alt="Abrir menú" />
            </button>

            <Modal
                isOpen={isMenuVisible}
                position='bottom-right'>
                <div className="social-icons menu-dropdown" ref={menuRef}>
                    <Link to="#" className="social-icon fab">
                        <img src={facebook} className="social facebook" />
                    </Link>
                    <Link to="#" className="social-icon x">
                        <img src={x} className="social x" />
                    </Link>
                    <Link to="#" className="social-icon what">
                        <img src={whatsapp} className="social whatsapp" />
                    </Link>
                    <Link to="#" className="social-icon link">
                        <img src={linkedin} className="social linkedin" />
                    </Link>
                    <Link to="#" className="social-icon inst">
                        <img src={instagram} className="social instagram" />
                    </Link>
                </div>
            </Modal>
        </footer>
    )
}

export default Footer
