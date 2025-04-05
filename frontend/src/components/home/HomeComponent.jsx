import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import { CardCarousel } from "../common/CardCarousel"
import datatypes from "../../js-files/Datatypes"
import evidence from "../../assets/evidence.jpeg"
import request from "../../assets/request.avif"
import defense_act from "../../assets/defense_act.jpg"
import info_persistance from "../../assets/info_persistance.jpg"
import tribunal from "../../assets/tribunal.jpg"
import roles from "../../assets/roles.jpeg"
import notification from "../../assets/notification.png"
import administration from "../../assets/administration.png"
import security from "../../assets/security.jpg"
import akademos from "../../assets/akademos.png"

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
    
    const navigate = useNavigate()
    const welcomeMessage = `Bienvenido ${user? user.name : "al Sistema de Gestión de Ejercicios de Culminación de Estudios"}`
    
    const featureItems = [
        {
          icon: { alt: "Gran cantidad de carpetas", src: evidence },
          title: "Gestión eficiente de evidencias",
          brief:
            "Permite a los estudiantes una simple recopilación y organización todas las evidencias académicas y extensionistas necesarias para el ECE de manera eficiente y organizada.",
          description:
            "La gestión de evidencias transforma la forma en que los estudiantes y administradores manejan la documentación necesaria para los procesos de culminación de estudios, desde reconocimientos hasta proyectos. Con una interfaz intuitiva, permite la carga, clasificación y seguimiento de evidencias de manera eficiente. Toda la información está siempre accesible y organizada, lo que reduce el tiempo de búsqueda y la mejora de la transparencia en el proceso educativo. Simplifica tu gestión académica y enfócate en lo que importa realmente",
        },
        {
          icon: { alt: "Celular con mensaje aproval en pantalla", src: request },
          title: "Evaluación de solicitudes de ECE",
          brief:
            "Facilita la evaluación de solicitudes de ejercicios de culminación de estudios con nuestro sistema, que agiliza el proceso y asegura una revisión justa y transparente para cada estudiante.",
          description:
            "Nuestro sistema permite a los evaluadores revisar y aprobar o no las solicitudes de ejercicios de culminación de estudios de manera rápida y efectiva, asegurando que cada estudiante reciba la atención que merece, permitiendo optimizar el proceso educativo. La transparencia en la evaluación fomenta la confianza entre estudiantes y administradores, creando un ambiente académico más colaborativo.",
        },
        {
          icon: {
            alt: "Varias personas reunidas escuchando la exposición de una específica",
            src: tribunal,
          },
          title: "Asignación y aprobación de tribunales simplificada",
          brief:
            "Agiliza la asignación y aprobación de tribunales con nuestra plataforma, que garantiza un proceso eficiente y transparente para la defensa de proyectos.",
          description:
            "La asignación y aprobación de tribunales es un paso crucial en el proceso de ejercicios de culminación de estudios. Con nuestra herramienta, puedes gestionar este proceso de forma fluida y sin complicaciones. La plataforma permite la creación de tribunales de forma rápida y la asignación de miembros de tribunal según su especialidad y disponibilidad. El sistema asegura que todas las aprobaciones se realizan de manera transparente, facilitando la comunicación entre estudiantes y evaluadores. Haz de cada defensa una experiencia enriquecedora.",
        },
        {
          icon: { alt: "Numerosas carpetas", src: defense_act },
          title: "Gestión segura de actas de defensa",
          brief:
            "Simplifica la gestión de las actas de defensa con nuestra solución, que permite un registro despejado, seguro y accesible de cada defensa realizada.",
          description:
            "La gestión de las actas de defensa es fundamental para documentar el proceso de ejercicios de culminación de estudios. Nuestra herramienta te permite registrar, almacenar y acceder a las actas de manera sencilla y organizada. Con las funciones que facilitan la edición y el seguimiento de cada documento, podrás asegurarte de tener una visión clara del desempeño académico de los estudiantes.",
        },
        {
          icon: {
            alt: "Conjunto de personas sentadas usando dispositivos electrónicos",
            src: roles,
          },
          title: "Gestión de permisos por roles",
          brief:
            "Controla el acceso y los permisos de los usuarios con nuestra herramienta de gestión por funciones, una administración segura y eficiente.",
          description:
            "La gestión de los permisos por roles es esencial para mantener la seguridad y la organización del sistema. Nuestra plataforma te permite definir y asignar roles específicos a cada usuario, permitiendo que tengan acceso solo a la información y funciones que necesitan. Mejoramos la seguridad de los datos y optimizamos la experiencia del usuario, con un sistema de permisos flexibles y fáciles de usar.",
        },
        {
          icon: { alt: "Celular al recibir una notificación", src: notification },
          title: "Envío de notificaciones en tiempo real",
          brief:
            "Mantén a los otros usuarios informados con nuestra funcionalidad de envío de notificaciones en tiempo real, que aseguran una comunicación fluida y oportuna entre estudiantes y administrativos.",
          description:
            "La comunicación efectiva es clave en nuestro entorno educativo. Nuestro sistema de envío de notificaciones permite que tanto estudiantes como administradores se mantengan al tanto de eventos importantes, fechas y líneas regulares, asegurando que la información llegue de forma oportuna. No dejes que la falta de comunicación afecte el éxito de tus estudiantes.",
        },
        {
          icon: {
            alt: "Captura de pantalla del panel de administración de usuarios del sistema",
            src: administration,
          },
          title: "Panel de administración de usuarios",
          brief:
            "Gestiona de manera eficiente a todos los usuarios de tu sistema con nuestro panel de administración, que ofrece un control total sobre roles y accesos.",
          description:
            "El panel de administración de usuarios es la herramienta que necesitas para tener un control total sobre la comunidad educativa. Con una interfaz intuitiva, puedes agregar, editar y eliminar usuarios, así como asignar roles y permisos específicos según las necesidades de cada miembro. Esto te permite personalizar la experiencia de cada usuario, que tiene acceso a la información y herramientas que realmente necesitan para desempeñar sus funciones. Con esta herramienta no solo optimizas la gestión de tu comunidad educativa, sino que también se fomenta un ambiente de colaboración y eficacia. Toma el control y transforma la administración de tu sistema educativo con facilidad.",
        },
        {
          icon: {
            alt: "Mapa del mundo con ícono de candado simulando seguridad",
            src: security,
          },
          title: "Robusta seguridad y privacidad para documentos sensibles",
          brief:
            "Garantiza un gran nivel de seguridad y confianza para el trabajo con todo tipo de documentos y adjuntos implicados en el proceso.",
          description: "",
        },
        {
          icon: {
            alt: "Varias carpetas etiquetadas con los años correspondientes",
            src: info_persistance,
          },
          title:
            "Persistencia de la información incluso años después de la graduación",
          brief:
            "Permite a los profesores visualizar y organizar fácilmente los datos sobre el proceso de años anteriores incluso cuando el individuo ya se graduó.",
          description: "",
        },
        {
          icon: { alt: "Captura de pantalla del logo de AKADEMOS", src: akademos },
          title: "Integración con AKADEMOS",
          brief:
            "Desarrollado por la Universidad de las Ciencias Informáticas (UCI) y concebido como un módulo integrado en el sistema de gestión universitaria Akademos.",
          description: "",
        },
    ]
    
    return (
        <>
            <section className="home-hero">
                <div className="home-hero-text">
                    <h2 className="home-hero-title">
                        {welcomeMessage}
                    </h2>

                    <p className="home-hero-content">
                        Una solución integral para la gestión de todo el proceso de ejercicios de culminación de estudios integrada con una herramienta multiplataforma que contribuye al perfeccionamiento de los procesos académicos de una institución.
                    </p>
                </div>
                
                <CardCarousel elements={featureItems}/>
            </section>
            
            <button 
                className="home-button"
                type="button"
                onClick={() => {navigate(redirect)}}
                >
                Acceder
            </button>
        </>
    )
}

export default HomeComponent