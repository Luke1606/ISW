import axios from "axios"

const notificationApi = axios.create({
    baseURL:'http://localhost:8000/notifications/',
})


export const sendNotification = async (title, content, action, filterCriteria) => {
    try {
        const response = await notificationApi.post('notificate/', {
            title: title,
            content: content,
            action: action,
            filter_criteria: filterCriteria,
        })
        return response.data
    } catch (error) {
        throw new Error('Error al enviar la notificación:' + error.message)
    }
}


export const setNotificationsSeen = async (userId, notificationIds) => {
    try {
        const response = await notificationApi.post(`${userId}/seen`, { ids: notificationIds })
        return response.data
    } catch (error) {
        throw new Error('Error al marcar como vista ' + Object.keys(notificationIds).length > 1? "las notificaciones: " : "la notification " + error.message)
    }
}


export const deleteNotifications = async (userId, notificationIds) => {
    try {
        const response = await notificationApi.delete(`${userId}/`, {ids: notificationIds})
        return response.data
    } catch (error) {
        throw new Error('Error al eliminar ', Object.keys(notificationIds).length > 1? "las notificaciones: " : "la notification " + error.message)
    }
}


export const getAllNotifications = async (userId) => {
    try {
        const response = await notificationApi.get(`${userId}/`)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener las notificaciones:' + error.message)
    }
}

