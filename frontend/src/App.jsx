import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import UserComponent from "./components/login/UserComponent"
import { UserProvider } from "./contexts/UserContext"
import Home from "./components/Home"
import ProtectedRoutesComponent from "./components/ProtectedRoutesComponent"
import Layout from "./components/common/layout/Layout"
import ListComponent from "./components/management/ListComponent"
import FormComponent from "./components/management/FormComponent"
import Error from "./components/common/Error"

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/login" element={ <UserComponent /> } />
                
                <Route element={ <Layout /> }>
                    <Route index element={<Home />}/>
                    
                    <Route element={ <ProtectedRoutesComponent /> }>      
                        <Route path="/list" element={ <ListComponent /> } />
                        <Route path="/form" element={ <FormComponent /> } />
                    </Route>
                </Route>

                <Route path="*" element={ 
                    <Error 
                        errorTitle="Dirección no encontrada" 
                        errorDescription="La ruta especificada no corresponde a ninguna dirección. Verifique la ruta." 
                        /> } 
                />
            </>
        )
    )

    return (
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
            )
}

export default App