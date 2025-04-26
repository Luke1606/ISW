import { Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import routes from "./routes"
import ToastNotification from "./components/common/ToastNotification"
import { AuthProvider } from "./contexts/AuthContext"
import useUserActivity from './hooks/Auth/useUserActivity'
import { ModalProvider } from "./contexts/ModalContext"
import { LoadingProvider } from "./contexts/LoadingContext"

/**
 * @param {Object} routes - Arreglo que contiene todas las rutas del sitio con sus paths, elements y sub-rutas (children).
 * @returns {Object} router - Objeto enrutador creado a partir de routes y usando las tags de características experimentales o de futuras versiones (v7) del react-router.
 */
const router = createBrowserRouter(routes, {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    },
})

/**
 * @description Estructura principal de la aplicación.
 * @returns Estructura de la aplicación compuesta por los siguientes componentes:
 * - <ToastNotification />: Muestra notificaciones emergentes en la interfaz.
 * - <Suspense fallback={<span className="spin"/>}>: Suspende la carga de componentes hijos hasta que estén disponibles, mostrando un spinner mientras tanto.
 * - <AuthProvider>: Provee contexto para la autenticación de usuarios.
 * - <LoadingProvider>: Provee manejo centralizado de estados de carga.
 * - <ModalProvider>: Provee funcionalidad para abrir y cerrar modales dentro de la aplicación.
 * - <RouterProvider router={router}>: Gestiona el enrutamiento utilizando la configuración definida en "router".
 */
const App = () => {
    useUserActivity()
    
    return (
        <>
            <ToastNotification />

            <Suspense fallback={<span className="spin"/>}>
                <AuthProvider>
                    <LoadingProvider>
                        <ModalProvider>
                            <RouterProvider router={router} />
                        </ModalProvider>
                    </LoadingProvider>
                </AuthProvider>
            </Suspense>
        </>
    )
}

export default App
