import Layout from "./components/common/layout/Layout"
import HomeComponent from "./components/home/HomeComponent"
import LoginComponent from "./components/login/LoginComponent"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import ListComponent from "./components/management/ListComponent"
import NotificationCenter from "./components/notifications/NotificationCenter"
import ErrorComponent from "./components/common/ErrorComponent"

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
                path: "login",
                element: <LoginComponent />,
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
