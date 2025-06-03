import { createApiInstance } from './'

const notificationsApiInstance = createApiInstance('http://localhost:8000/notifications/')

const handleRequest = async (method, url='', options = {}) => {
    try {
        const response = await notificationsApiInstance[method](url, options)
        console.log(response);
        return response.data
    } catch (error) {
        const errorStatus = error.request.status
        const errorHeader = error.request.statusText
        const errorMessage = error.response.data.error
        throw new Error(`${errorStatus} ${errorHeader}: ${errorMessage}`)
    }
}

const getNotifications = () =>
    handleRequest('get')

const markNotificationAsRead = (id) =>
    handleRequest('put', `${id}/mark_as_read/`)

const deleteNotification = (id) =>
    handleRequest('delete', `${id}/`)

const notificationsApi = {
    getNotifications, 
    markNotificationAsRead, 
    deleteNotification
}
export default notificationsApi