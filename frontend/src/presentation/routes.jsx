import Layout from "./components/layout/Layout"
import HomeComponent from "./pages/home/HomeComponent"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import ListComponent from "./pages/management/ListComponent"
import NotificationCenter from "./pages/notifications/NotificationCenter"
import ErrorComponent from "./components/error/ErrorComponent"

const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomeComponent />,
            },
            {
                path: "*",
                element: (
                    <ErrorComponent
                        errorTitle="Dirección no encontrada"
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta."
                    />
            )},
            {
                element: <ProtectedRoutesComponent />,
                children: [
                    {
                        path: "notifications",
                        element: <NotificationCenter />,
                    },
                    {
                        path: "list/:datatype/:relatedUserId?",
                        element: <ListComponent />,
                    },
                ],
            },
        ],
    },
]

export default routes
