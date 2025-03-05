import { useNavigate } from "react-router-dom"
import icon from "../assets/option.png"

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
                    <h2 className="home-hero-title">
                        Bienvenido al Sistema de Gestión de Ejercicios de Culminación de
                        Estudios
                    </h2>

                    <p className="home-hero-content">
                        Una solución integral para la gestión de todo el proceso de ejercicios de culminación de estudios. Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur atque tenetur non quibusdam cum voluptates magnam voluptatem dolore sint! Saepe officia inventore ut distinctio, optio ipsum! Earum sit impedit quaerat.
                    </p>
        
                    <button 
                        className="home-hero-button"
                        type="button"
                        onClick={() => {navigate("/login")}}
                        >
                        Acceder
                    </button>
                </div>
            </section>
        )
}

const FeaturesSection = () => {
    return (
            <section 
                className="home-features-section"
                >
                <h2 
                    className="home-features-title"
                    >
                    Funcionalidades del Sistema
                </h2>

                <p 
                    className="home-features-content"
                    >
                    Descubre cómo nuestro sistema puede ayudarte en la gestión del ECE.
                </p>

                <div 
                    className="home-features-container"
                    >
                
                    <Feature
                        icon={{
                            alt:"Gestión de evidencias con iconos de documentos y carpetas",
                            src:{icon}}}
                        title="Gestión de Evidencias"
                        content="Permite a los estudiantes gestionar todas las evidencias
                            necesarias para el ECE de manera eficiente y organizada."
                        />

                    <Feature
                        icon={{
                            alt:"Solicitud de tribunales con iconos de jueces y martillos",
                            src:{icon}}}
                        title="Solicitudes de Tribunales"
                        content="Facilita la solicitud y asignación de tribunales para la
                            defensa del ECE."
                        />

                    <Feature
                        icon={{
                            alt:"Gestión de defensas con iconos de presentaciones y micrófonos",
                            src:{icon}}}
                        title="Gestión de Defensas"
                        content="Organiza y gestiona las defensas de los ejercicios de
                            culminación de estudios de manera efectiva."
                        />

                    <Feature
                        icon={{
                            alt:"Actas de defensa con iconos de documentos firmados",
                            src:{icon}}}
                        title="Actas de Defensa"
                        content="Permite a los estudiantes acceder a los datos sobre el proceso
                            que decidan los profesores."
                        />
                    <Feature
                        icon={{
                            alt:"Acceso a datos con iconos de gráficos y estadísticas",
                            src:{icon}}}
                        title="Acceso a Datos"
                        content="Genera y gestiona las actas de defensa de manera automatizada
                            y segura."
                        />

                    <Feature
                        icon={{
                            alt:"Integración con Akademos con iconos de sistemas conectados",
                            src:{icon}}}
                        title="Integración con Akademos"
                        content="Desarrollado por la Universidad de las Ciencias Informáticas
                            (UCI) y concebido como un módulo integrado en el sistema de
                            gestión universitaria Akademos."
                        />    
                </div>
            </section>
        )
}

const Feature = (icon, title, content) => {
    return(
            <div className="feature-card" data-aos="fade-left" data-aos-duration="1000">
                <div className="feature-card-inner">
                    <div className="feature-card-front">
                        <img alt={icon.alt} className="feature-icon" src={icon} />
                    </div>
                
                    <div className="feature-card-back">
                        <h3 
                            className="feature-card-title"
                            >
                            {title}
                        </h3>
                        
                        <p 
                            className="feature-card-content"
                            >
                            {content}
                        </p>
                    </div>    
                </div>
            </div>
        )                                
}
