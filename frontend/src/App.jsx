import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routes from './presentation'
import { ErrorBoundary, ToastNotification } from './presentation'
import { AuthProvider, useUserActivity, ModalProvider, LoadingProvider } from './logic'

/**
 * @description Crea un enrutador basado en las rutas del sitio.
 *
 * @param {Array} routes - Arreglo que contiene todas las rutas del sitio:
 *  - `path`: Ruta del sitio (string).
 *  - `element`: Componente asociado a la ruta (React.ReactNode).
 *  - `children`: Sub-rutas opcionales (array).
 * 
 * @returns {Object} `router` - Objeto enrutador basado en React Router.
 *  Utiliza las características experimentales:
 *  - `v7_startTransition`: Mejora de rendimiento para transiciones.
 *  - `v7_relativeSplatPath`: Manejo más limpio de rutas relativas. 
 */
const router = createBrowserRouter(routes, {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    },
})

/**
 * Componente sin estructura, su único propósito es vigilar la actividad del usuario en la aplicación
 * en todo momento para que {@link useUserActivity} funcione.
 * @returns `null`
 */
const UserActivityMonitor = () => {
    useUserActivity()
    return null // No necesita renderizar nada
}

/**
 * @description Estructura principal de providers de la aplicación. Tambien ejecuta el {@link useUserActivity}.
 * 
 * @returns Estructura de la aplicación compuesta por los siguientes componentes:
 * - {@link ErrorBoundary}- Para manejo personalizado de errores.
 * - {@link ToastNotification}- Para notificaciones emergentes en la interfaz.
 * - {@link Suspense}- Suspende la carga de componentes hijos hasta que estén disponibles, mostrando un spinner (<span className="spin"/>) mientras tanto.
 * - {@link AuthProvider}- Provider para la autenticación de usuarios.
 * - {@link LoadingProvider}- Provider para manejo centralizado de estados de carga.
 * - {@link ModalProvider}- Provider para funcionalidad de abrir y cerrar modales dentro de la aplicación.
 * - {@link RouterProvider}- Gestiona el enrutamiento utilizando la configuración definida en {@link router}.
 */
const App = () => {
    return (
        <>
        <ErrorBoundary>
            <ToastNotification />

            <Suspense fallback={<span className='spinner'/>}>
                <AuthProvider>
                    <LoadingProvider>
                        <ModalProvider>
                            <UserActivityMonitor />
                            <RouterProvider router={router} />
                        </ModalProvider>
                    </LoadingProvider>
                </AuthProvider>
            </Suspense>
        </ErrorBoundary>
        </>
    )
}

export default App
