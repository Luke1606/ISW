import { useState, useEffect, useContext } from "react"
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
import { AuthContext } from "../contexts/AuthContext"
import datatypes from "../js-files/Datatypes"

const HomeComponent = () => {
    const { user } = useContext(AuthContext)
    let redirect
    if (user) {
        if (user?.role === datatypes.user.student)
            redirect = `/list/${datatypes.evidence}/${user.id}/`
        else if (user?.role === datatypes.user.professor)
            redirect = `/list/${datatypes.user.student}/${user.id}`
        else
           redirect = `/list/${datatypes.user.student}/`
    } else
        redirect = '/login'

    return (
            <>
                <HeroSection redirect={redirect}/>
                { !user && <FeaturesSection />}
            </>
        )
}

export default HomeComponent


const HeroSection = ({redirect}) => {
    const navigate = useNavigate()
    return (
            <section className="home-hero">
                <div className="home-hero-container">
                    <h2 className="home-hero-title">
                        Bienvenido al Sistema de Gestión de Ejercicios de Culminación de
                        Estudios
                    </h2>

                    <p className="home-hero-content">
                        Una solución integral para la gestión de todo el proceso de ejercicios de culminación de estudios integrada con una herramienta multiplataforma que contribuye al perfeccionamiento de los procesos académicos de una institución. Su uso permite el desarrollo coherente de una estrategia organizacional que articule todos los niveles de decisión presentes en los procesos universitarios. Todos los roles del proceso educativo están involucrados en la solución, por lo que se permitirá el acceso a la información de forma segura a todos los niveles, facilitando la toma de decisiones.
                    </p>
        
                    <button 
                        className="home-hero-button"
                        type="button"
                        onClick={() => navigate(redirect)}
                        >
                        Acceder
                    </button>
                </div>
            </section>
        )
}

HeroSection.propTypes = {
    redirect: PropTypes.string.isRequired,
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

                <div 
                    className="home-features-container"
                    >
                
                    <Feature
                        icon={{
                            alt:"Gran cantidad de carpetas",
                            src: evidence}}
                        title="Gestión eficiente de evidencias"
                        
                        brief="Permite a los estudiantes una simple recopilación y organización todas las evidencias académicas y extensionistas necesarias para el ECE de manera eficiente y organizada."
                        >
                        La gestión de evidencias transforma la forma en que los estudiantes y administradores manejan la documentación necesaria para los procesos de culminación de estudios, desde reconocimientos hasta proyectos. Con una interfaz intuitiva, permite la carga, clasificación y seguimiento de evidencias de manera eficiente. Toda la información está siempre accesible y organizada, lo que reduce el tiempo de búsqueda y la mejora de la transparencia en el proceso educativo. Simplifica tu gestión académica y enfócate en lo que importa realmente
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Celular con mensaje aproval en pantalla",
                            src: request}}
                        title="Evaluación de solicitudes de ECE"
                        
                        brief="Facilita la evaluación de solicitudes de ejercicios de culminación de estudios con nuestro sistema, que agiliza el proceso y asegura una revisión justa y transparente para cada estudiante."
                        
                        >
                        Nuestro sistema permite a los evaluadores revisar y aprobar o no las solicitudes de ejercicios de culminación de estudios de manera rápida y efectiva, asegurando que cada estudiante reciba la atención que merece, permitiendo optimizar el proceso educativo. La transparencia en la evaluación fomenta la confianza entre estudiantes y administradores, creando un ambiente académico más colaborativo.                         
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Varias personas reunidas escuchando la exposición de una específica",
                            src: tribunal}}
                        title="Asignación y aprobación de tribunales simplificada"
                        
                        brief="Agiliza la asignación y aprobación de tribunales con nuestra plataforma, que garantiza un proceso eficiente y transparente para la defensa de proyectos."
                        >
                        La asignación y aprobación de tribunales es un paso crucial en el proceso de ejercicios de culminación de estudios. Con nuestra herramienta, puedes gestionar este proceso de forma fluida y sin complicaciones. La plataforma permite la creación de tribunales de forma rápida y la asignación de miembros de tribunal según su especialidad y disponibilidad. El sistema asegura que todas las aprobaciones se realizan de manera transparente, facilitando la comunicación entre estudiantes y evaluadores. Haz de cada defensa una experiencia enriquecedora.
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Numerosas carpetas",
                            src: defense_act}}
                        title="Gestión segura de actas de defensa"
                        
                        brief="Simplifica la gestión de las actas de defensa con nuestra solución, que permite un registro despejado, seguro y accesible de cada defensa realizada."
                        >
                        La gestión de las actas de defensa es fundamental para documentar el proceso de ejercicios de culminación de estudios. Nuestra herramienta te permite registrar, almacenar y acceder a las actas de manera sencilla y organizada. Con las funciones que facilitan la edición y el seguimiento de cada documento, podrás asegurarte de tener una visión clara del desempeño académico de los estudiantes.
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Conjunto de personas sentadas usando dispositivos electrónicos",
                            src: roles}}
                        title="Gestion de permisos por roles"
                        
                        brief="Controla el acceso y los permisos de los usuarios con nuestra herramienta de gestión por funciones, una administración una segura y eficiente."
                        >
                        La gestión de los permisos por roles es esencial para mantener la seguridad y la organización del sistema. Nuestra plataforma te permite definir y asignar roles específicos a cada usuario, permitiendo que tengan acceso solo a la información y funciones que necesitan. Mejoramos la seguridad de los datos y optimizamos la experiencia del usuario, con un sistema de permisos flexibles y fáciles de usar.
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Celular al recibir una notificación",
                            src: notification}}
                        title="Envío de notificaciones en tiempo real"
                        
                        brief="Mantén a los otros usuarios informados con nuestra funcionalidad de envío de notificaciones en tiempo real, que aseguran una comunicación fluida y oportuna entre estudiantes y administrativos."
                        >
                        La comunicación efectiva es clave en nuestro entorno educativo. Nuestro sistema de envío de notificaciones permite que tanto estudiantes como administradores se mantengan al tanto de eventos importantes, fechas y líneas regulares, asegurando que la información llegue de forma oportuna. No dejes que la de la comunicación confectara el éxito de tus estudiantes.
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Captura de pantalla del panel de administración de usuarios del sistema",
                            src: administration}}
                        title="Panel de administración de usuarios"
                        
                        brief="Gestiona de manera eficiente a todos los usuarios de tu sistema con nuestro panel de administración, que ofrece un control total sobre roles y accesorios."
                        >
                        El panel de administración de usuarios es la herramienta que necesitas para tener un control total sobre la comunidad educativa. Con una interfaz intuitiva, puedes agregar, editar y eliminar usuarios, así como asignar roles y permisos específicos según las necesidades de cada miembro. Esto te permite personalizar la experiencia de cada usuario, que tiene acceso a la información y herramientas que realmente necesitan para desempeñar sus funciones. Con esta herramienta no solo optimizas la gestión de tu comunidad educativa, sino que también se fomenta un ambiente de colaboración y eficacia. Toma el control y transforma la administración de tu sistema educativo con facilidad.
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Mapa del mundo con ícono de candado simulando seguridad",
                            src: security}}
                        title="Robusta seguridad y privacidad para documentos sensibles"
                        
                        brief="Garantiza un gran nivel de seguridad y confianza para el trabajo con todo tipo de documentos y adjuntos implicados en el proceso."
                        >
                        ola
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Varias carpetas etiquetadas con los años correspondientes",
                            src: info_persistance}}
                        title="Persistencia de la información incluso años después de la graduación"
                        
                        brief="Permite a los profesores visualizar y organizar fácilmente los datos sobre el proceso de años anteriores incluso cuando el individuo ya se graduó."
                        >
                        ola
                    </Feature>

                    <Feature
                        icon={{
                            alt:"Captura de pantalla del logo de AKADEMOS",
                            src: akademos}}
                        title="Integración con AKADEMOS"
                        
                        brief="Desarrollado por la Universidad de las Ciencias Informáticas (UCI) y concebido como un módulo integrado en el sistema de gestión universitaria Akademos."
                        >
                        ola
                    </Feature>
                </div>
            </section>
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
