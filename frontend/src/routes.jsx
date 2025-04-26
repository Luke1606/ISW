import Layout from "./components/common/layout/Layout"
import HomeComponent from "./components/home/HomeComponent"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import ListComponent from "./components/management/ListComponent"
import NotificationCenter from "./components/notifications/NotificationCenter"
import ErrorComponent from "./components/common/ErrorComponent"

/**
* @description Arreglo que contiene todas las rutas del sitio con sus paths, elements y sub-rutas (children).
* Está diseñado para estructurar la navegación de la aplicación.
*/


const routes = [
    {
        /**
         * @description Ruta principal que renderiza el Layout general de la aplicación.
         * Contiene las subrutas principales.
         */
        path: "/",
        element: <Layout />,
        children: [
            {
                /**
                 * @description Ruta principal de inicio.
                 * Renderiza el componente HomeComponent en la página raíz.
                 */
                index: true,
                element: <HomeComponent />,
            },
            {
                /**
                 * @description Ruta para manejar errores de navegación (404).
                 * Renderiza el ErrorComponent con un mensaje personalizado.
                 */
                path: "*",
                element: (
                    <ErrorComponent
                        errorTitle="Dirección no encontrada"
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta."
                    />
            )},
            {
                /**
                 * @description Rutas protegidas que requieren autenticación.
                 * Renderiza subrutas restringidas dentro de ProtectedRoutesComponent.
                 */
                element: <ProtectedRoutesComponent />,
                children: [
                    {
                        /**
                         * @description Ruta para el centro de notificaciones.
                         * Renderiza el componente NotificationCenter.
                         */
                        path: "notifications",
                        element: <NotificationCenter />,
                    },
                    {
                        /**
                         * @description Ruta para mostrar una lista basada en un tipo de datos y un usuario relacionado (opcional).
                         * 
                         * @param {string} datatype - Tipo de datos a listar.
                         * @param {string} [relatedUserId] - ID opcional del usuario relacionado.
                         * Renderiza el ListComponent.
                         */
                        path: "list/:datatype/:relatedUserId?",
                        element: <ListComponent />,
                    },
                ],
            },
        ],
    },
]

export default routes
