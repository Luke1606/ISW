import axios from 'axios'
import { ACCESS_TOKEN_KEY } from './Constants'
import { getToken } from './TokenHelpers'

const eceApi = axios.create({
    baseURL: 'http://localhost:8000/api/',
})

eceApi.interceptors.request.use(
    (config) => {
        const token = getToken(ACCESS_TOKEN_KEY)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

eceApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.log("Unauthorized")
                    break
                case 402:
                    console.log("Payment Required")
                    break
                case 403:
                    console.log("Forbidden")
                    break
                case 404:
                    console.log("Not Found")
                    break
                default:
                    return Promise.reject(error)
            }
        }
    }
)

export const sendNotification = async (header, description, onClick) => {
    try {
        const response = await eceApi.post('notifications/notificate/', {
            header,
            description,
            onClick,
        });
        return response.data;
    } catch (error) {
        console.error('Error al enviar la notificación:', error);
        throw new Error('Error al enviar la notificación');
    }
};

export const getAllNotifications = async () => {
    try {
        const response = await eceApi.get('notifications/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        throw new Error('Error al obtener las notificaciones');
    }
};

export default eceApi