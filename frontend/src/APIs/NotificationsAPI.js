import { createApiInstance } from "./APIConfig"

const notificationsApi = createApiInstance("http://localhost:8000/notifications/")

const handleRequest = async (method, url='', options = {}) => {
    try {
        const response = await notificationsApi[method](url, options)
        return response.data
    } catch (error) {
        const errorStatus = error.request.status
        const errorHeader = error.request.statusText
        const errorMessage = error.response.data.error
        throw new Error(`${errorStatus} ${errorHeader}: ${errorMessage}`)
    }
}

export const getNotifications = () =>
    handleRequest('get')

export const markNotificationAsRead = (id) =>
    handleRequest('put', `${id}/`)

export const deleteNotification = (id) =>
    handleRequest('delete', `${id}/`)