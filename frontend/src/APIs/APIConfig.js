import axios from "axios"
import * as authApi from "./AuthAPI"
import * as tokens from "./Constants"

export const setupInterceptors = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = authApi.getToken(tokens.ACCESS_TOKEN_KEY)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
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

                            const refreshToken = authApi.getToken(tokens.REFRESH_TOKEN_KEY)
                            if (!refreshToken) {
                                authApi.deleteToken(tokens.ACCESS_TOKEN_KEY)
                                authApi.deleteToken(tokens.REFRESH_TOKEN_KEY)
                                return Promise.reject("No estás autenticado")
                            }

                            try {
                                const response = await authApi.getNewAccessToken(refreshToken)
                                const newAccessToken = response.data.access
                                authApi.setToken(tokens.ACCESS_TOKEN_KEY, newAccessToken)

                                // Actualiza el encabezado y reintenta la solicitud original
                                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                                return instance(originalRequest)
                            } catch (error) {
                                authApi.deleteToken(tokens.ACCESS_TOKEN_KEY)
                                authApi.deleteToken(tokens.REFRESH_TOKEN_KEY)
                                console.log(error)
                                return Promise.reject("Sesión expirada. Por favor, inicia sesión nuevamente.")
                            } 
                        } 
                    }
                    break
                case 402:
                    throw new Error(`Payment Required: ${error.response}`)
                case 403:
                    throw new Error(`Forbidden: ${error.response}`)
                case 404:
                    throw new Error(`Not Found: ${error.response}`)
                case 500:
                    throw new Error(`Internal Server Issue: ${error.response}`)
                default:
                    return Promise.reject(error)
            }
        }
    )
}

export const createApiInstance = (baseURL) => {
    const instance = axios.create({ baseURL })
    setupInterceptors(instance)
    return instance
}