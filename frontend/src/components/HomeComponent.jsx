import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import evidence from "../assets/evidence.jpeg"
import request from "../assets/request.avif"
import defense_act from "../assets/defense_act.jpg"
import info_persistance from "../assets/info_persistance.jpg"
import tribunal from "../assets/tribunal.jpg"
import roles from "../assets/roles.jpeg"
import notification from "../assets/notification.png"
import administration from "../assets/administration.png"
import security from "../assets/security.jpg"
import akademos from "../assets/akademos.png"
import { FeaturesCarousel } from './FeaturesCarousel'

const HomeComponent = () => {
    return (
            <>
                <HeroSection />
                <FeaturesSection />
            </>
        )
}

export default HomeComponent


const HeroSection = () => {
    const navigate = useNavigate()
    return (
            <section className="home-hero">
                <div className="home-hero-container">
                    <div>
                    <h2 className="home-hero-title">
                        Bienvenido al Sistema de Gestión de Ejercicios de Culminación de
                        Estudios
                    </h2>
                    <button 
                        className="home-hero-button"
                        type="button"
                        onClick={() => {navigate("/login")}}
                        >
                        Acceder
                    </button>
                    </div>
                <FeaturesCarousel />
                   
                </div>
                 {/* <p className="home-hero-content">
                        Una solución integral para la gestión de todo el proceso de ejercicios de culminación de estudios integrada con una herramienta multiplataforma que contribuye al perfeccionamiento de los procesos académicos de una institución. Su uso permite el desarrollo coherente de una estrategia organizacional que articule todos los niveles de decisión presentes en los procesos universitarios. Todos los roles del proceso educativo están involucrados en la solución, por lo que se permitirá el acceso a la información de forma segura a todos los niveles, facilitando la toma de decisiones.
                    </p>*/}
              
            </section>
        )
}

const FeaturesSection = () => {
    const [overlay, setOverlay] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const section = document.querySelector('.home-features-section')
            if (section) {
                const rect = section.getBoundingClientRect()
                const windowHeight = window.innerHeight

                if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                    setOverlay(true)
                } else {
                    setOverlay(false)
                }
            }
        };

        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <>

<section 
                className= "home-features-section"
                >
                <div 
                    className={overlay? "home-features-section-overlay" : "home-features-overlay-hidden"}>
                    <h2 
                        className="home-features-title"
                        >
                        Funcionalidades del Sistema
                    </h2>

                    <p 
                        className="home-features-content"
                        >
                        Descubre cómo nuestra herramienta de gestión diseñada para facilitar el seguimiento de los procesos de ejercicios de culminación de estudios puede ayudarte.
                    </p>
                </div>                
            <FeaturesCarousel />
            </section>
            
        </>
            
        )
}

const Feature = ({icon, title, brief, children}) => {
    return(
            <div className="feature-card" data-aos="fade-left" data-aos-duration="1000">
                <div className="feature-card-inner">
                    <div className="feature-card-front">
                        <img alt={icon.alt} className="feature-icon" src={icon.src} />
                    </div>
                
                    <div className="feature-card-back">
                        <h3 
                            className="feature-card-title"
                            >
                            {title}
                        </h3>
                        
                        <p 
                            className="feature-card-brief"
                            >
                            {brief}
                        </p>

                        <div
                            className="feature-card-content"
                            >
                            {children}
                        </div>
                    </div>    
                </div>
            </div>
        )                                
}

Feature.propTypes = {
    icon: PropTypes.object,
    title: PropTypes.string.isRequired,
    brief: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
}
