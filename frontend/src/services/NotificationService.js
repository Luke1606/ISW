import * as notificationApi from "../APIs/NotificationApi"

class ManagementService {
    async sendNotification(notification) {
        return await notificationApi.sendNotification(notification)
    }

    async setNotificatiosnSeen(userId, notificationIds) {
        return await notificationApi.setNotificationsSeen(userId, notificationIds)
    }
    
    async deleteNotifications(userId, notificationIds) {
        return await notificationApi.deleteNotifications(userId, notificationIds)
    }
    
    async getAllNotifications(userId) {
        return await notificationApi.getAllNotifications(userId)
    }
}

export default new ManagementService()