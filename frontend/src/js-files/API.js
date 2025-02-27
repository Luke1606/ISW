import axios from 'axios'
import { ACCESS_TOKEN_KEY } from './Constants'
import { getToken } from './TokenHelpers'

const eceApi = axios.create({
    // eslint-disable-next-line no-undef
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
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

const getUrl = (datatype, superId) => `/${datatype}/${superId ? `${superId}/` : ''}`


export const getAllData = async (datatype, superId) => {
    if (!datatype) 
        throw new Error('Datatype is required')

    try {
        const response = await eceApi.get(getUrl(datatype, superId))
        return response.data
    } catch (error) {
        console.error('Error fetching all data:', error)
        throw error
    }
}

export const getData = async (datatype, id, superId ) => {
    if (!datatype || !id) 
        throw new Error('Datatype and id are required')
    
    try {
        const response = await eceApi.get(`${getUrl(datatype, superId)}`, {params: id})
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        throw error
    }
}

export const createData = async (datatype, data, superId) => {
    if (!datatype || !data) 
        throw new Error('Datatype and data are required')
    
    try {
        const response = await eceApi.post(getUrl(datatype, superId), data)
        return response.data
    } catch (error) {
        console.error('Error creating data:', error)
        throw error
    }
}

export const updateData = async (datatype, id, data, superId) => {
    if (!datatype || !id || !data) 
        throw new Error('Datatype, id and new data are required')
    
    try {
        const response = await eceApi.put(getUrl(datatype, superId), {params: id}, data)
        return response.data
    } catch (error) {
        console.error('Error updating data:', error)
        throw error
    }
}

export const deleteData = async (datatype, id, superId) => {
    if (!datatype || !id) 
        throw new Error('Datatype and id are required')
    
    try {
        const response = await eceApi.delete(getUrl(datatype, superId), {params: id})
        return response.data
    } catch (error) {
        console.error('Error deleting data:', error)
        throw error
    }
}

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