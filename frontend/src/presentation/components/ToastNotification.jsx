import { ToastContainer } from "react-toastify"

/**
 * @description Contenedor destinado a renderizar las notificaciones toast cuando se llame a `toast`.
 * @returns Componente que renderiza las notificaciones.
 */
const ToastNotification = () => 
    <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        newestOnTop={true}
        draggable={false}
    />

export default ToastNotification