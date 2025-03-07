import { useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../contexts/AuthContext"

const useSideMenuOptions = () => {
    const location = useLocation()
    const currentPath = location.pathname
    const [ isVisible, setIsVisible ] = useState(false)

    useEffect(() => {
        if (currentPath === "/tree" || currentPath === "/form") {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [currentPath])

    let options=['No hay opciones disponibles']

    switch (currentPath) {
        case "/tree":
            options = [
                "Filtrar",
                "Ordenar"
            ]
            break
        case "/form":
            options = [
                "General",
                "Apariencia",
                "Otra opción",
                "Otra opción"
            ]
            break
    }
    return { options, isVisible}
}

const useHeaderOptions = () => {
    let options = []
    const { user } = useContext(AuthContext)

    if(user)
        options.push({
            title: "Notificaciones",
            action: "#"
        },
        {
            title: "Generar Reporte",
            action: "#"
        })

    return options
}

export { useSideMenuOptions, useHeaderOptions }

