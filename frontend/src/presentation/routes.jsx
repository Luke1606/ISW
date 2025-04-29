import { 
    NotificationCenter, 
    ProtectedRoutes, 
    Layout, 
    Home, 
    List, 
    Error
} from './'

const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "*",
                element: (
                    <Error
                        errorTitle="Dirección no encontrada"
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta."
                    />
            )},
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        path: "notifications",
                        element: <NotificationCenter />,
                    },
                    {
                        path: "list/:datatype/:relatedUserId?",
                        element: <List />,
                    },
                ],
            },
        ],
    },
]

export default routes
