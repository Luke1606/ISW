import { 
    Home, 
    Error,
    Layout, 
    ListWrapper, 
    ProtectedRoutes, 
    NotificationCenter
} from './'

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        path: 'list/:datatype/:relatedUserId?',
                        element: <ListWrapper />,
                    },
                    {
                        path: 'notifications',
                        element: <NotificationCenter />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: (
            <Error
                errorTitle='Dirección no encontrada'
                errorDescription='La ruta especificada no corresponde a ninguna dirección. Verifique la ruta.'
            />
    )},
]

export default routes
