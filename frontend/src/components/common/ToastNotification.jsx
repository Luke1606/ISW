import { ToastContainer } from "react-toastify"

/**
 * @description Componente ToastNotification para mostrar notificaciones emergentes en la aplicación.
 * Utiliza `react-toastify` para la gestión de alertas visuales.
 *
 * @returns {JSX.Element} - Renderiza un contenedor de notificaciones con configuración predefinida.
 *
 * @example
 * // Uso en la aplicación
 * import ToastNotification from "./ToastNotification";
 * function App() {
 *     return (
 *         <div>
 *             <ToastNotification />
 *         </div>
 *     );
 * }
 */

const ToastNotification = () => 
    <ToastContainer
        position="top-center" // Posición en la parte superior centrada
        theme= "colored" // Estilo colorido para los mensajes
        autoClose={7000} // Cierra automáticamente después de 7 segundos
        hideProgressBar={false} // Muestra la barra de progreso
        closeOnClick // Permite cerrar el mensaje al hacer clic
        pauseOnHover // Pausa el temporizador cuando se pasa el cursor sobre la notificación
        newestOnTop={true} // Muestra las notificaciones más recientes en la parte superior
        draggable={false} // Desactiva la capacidad de arrastrar la notificación
    />

export default ToastNotification