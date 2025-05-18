/**
 * @fileoverview Este archivo contiene funciones relacionadas con la configuración de APIs
 * @module apiConfig
 * @description Configuración de interceptors para todas las APIs del sistema.
 */
import axios from 'axios'
import { authApi, accessToken } from './'

const setupInterceptors = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            if (accessToken)
                config.headers.Authorization = `Bearer ${accessToken}`
            return config
        },
        (error) => Promise.reject(error)
    )

    let retry = false

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config
            const errorResponse = error?.response?.data
            switch (error.response?.status) {
                case 400:
                    {
                        console.error(errorResponse)
                        return Promise.reject(new Error(`La petición no es válida. ${errorResponse || ''}`))
                    }
                case 401: 
                    {
                        console.error(error?.response?.data)
                        if(!retry){
                            retry = true
                            const errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
            
                            if (!accessToken) {
                                try {
                                    const response = await authApi.setNewAccessToken()

                                    if (response.success) { // Reintenta la solicitud original con el token actualizado
                                        originalRequest.headers.Authorization = `Bearer ${accessToken}`
                                        return instance(originalRequest)
                                    } else {
                                        authApi.closeSession() // Cerrar sesión si el refresco del token falla
                                        return Promise.reject(new Error(errorMessage))
                                    }
                                } catch (error) {
                                    console.log(error)
                                    return Promise.reject(new Error(error.message))
                                } 
                            } 
                        } else 
                            return Promise.reject(new Error('No se ha podido autenticar. Verifique sus credenciales'))
                    }
                    break
                case 403:
                    {
                    console.error(error?.response?.data)
                    return Promise.reject(new Error(`No tiene acceso a este recurso. ${errorResponse}`))
                    }
                case 404:
                    {
                    console.error(error?.response?.data)
                    return Promise.reject(new Error(`Recurso no encontrado. ${errorResponse}`))
                    }
                case 500:
                    {
                    console.error(error?.response?.data)
                    return Promise.reject(new Error(`Problemas del servidor. ${errorResponse}`))
                    }
                default:
                    return Promise.reject(error)
            }
        }
    )
}

const createApiInstance = (baseURL, otherParams = {}) => {
    const instance = axios.create({ baseURL, ...otherParams })
    setupInterceptors(instance)
    return instance
}

export default createApiInstance