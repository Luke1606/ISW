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

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config

            switch (error.response?.status) {
                case 401: 
                    { 
                        if(!originalRequest._retry){
                            originalRequest._retry = true

                            if (!accessToken) {
                                return Promise.reject('No estás autenticado')
                            }

                            try {
                                const response = await authApi.setNewAccessToken()

                                if (response.success) { // Reintenta la solicitud original con el token actualizado
                                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                                    return instance(originalRequest)
                                } else {
                                    authApi.closeSession() // Cerrar sesión si el refresco del token falla
                                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
                                }
                            } catch (error) {
                                console.log(error)
                                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
                            } 
                        } 
                    }
                    break
                case 403:
                    throw new Error('No tiene acceso a este recurso')
                case 404:
                    throw new Error('Recurso no encontrado')
                case 500:
                    throw new Error('Problemas del servidor')
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