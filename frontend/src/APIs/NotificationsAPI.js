import { createApiInstance } from './'

const notificationsApiInstance = createApiInstance('http://localhost:8000/notifications/')

const handleRequest = async ({method, url='', data = null, params = {}}) => {
    try {
        const response = data?
            await notificationsApiInstance[method](url, data, { params })
            :
            await notificationsApiInstance[method](url, { params })   
        return response.data
    } catch (error) {
        const errorStatus = error.request.status
        const errorHeader = error.request.statusText
        const errorMessage = error.response.data.error
        throw new Error(`${errorStatus} ${errorHeader}: ${errorMessage}`)
    }
}

const getNotifications = async () =>
    await handleRequest({ method: 'get' })

const toggleNotificationAsRead = async (ids) =>
    await handleRequest({
        method:'put',
        url: 'toggle_as_read/',
        data: { ids }
    })

const deleteNotification = async (ids) =>
    await handleRequest({
        method: 'delete',
        data: { data: { ids } }
    })

const notificationsApi = {
    getNotifications, 
    deleteNotification,
    toggleNotificationAsRead, 
}
export default notificationsApi