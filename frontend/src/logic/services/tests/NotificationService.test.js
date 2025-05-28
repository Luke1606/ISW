/* eslint-disable no-undef */
import { toast } from 'react-toastify'
import Push from 'push.js'
import { notificationsApi } from '@/APIs'
import { NotificationService } from '@/logic'

// Simular `notificationsApi`, `Push`, y `toast`
jest.mock('@/APIs', () => ({
    notificationsApi: {
        getNotifications: jest.fn(),
        markNotificationAsRead: jest.fn(),
        deleteNotification: jest.fn(),
    }
}))

jest.mock('push.js', () => ({
    create: jest.fn(),
    Permission: {
        has: jest.fn().mockReturnValue(true), // Simulamos que el usuario permite notificaciones
    }
}))

jest.mock('react-toastify', () => ({
    toast: jest.fn(),
}));

describe('NotificationService', () => {
    it('should call getNotifications', async () => {
        notificationsApi.getNotifications.mockResolvedValue([{ id: 1, message: 'Test notification' }])

        const response = await NotificationService.get()
        
        expect(notificationsApi.getNotifications).toHaveBeenCalled()
        expect(response).toEqual([{ id: 1, message: 'Test notification' }])
    })

    it('should mark a notification as read', async () => {
        notificationsApi.markNotificationAsRead.mockResolvedValue({ success: true })

        const response = await NotificationService.markAsRead(1)

        expect(notificationsApi.markNotificationAsRead).toHaveBeenCalledWith(1)
        expect(response.success).toBe(true)
    })

    it('should delete a notification', async () => {
        notificationsApi.deleteNotification.mockResolvedValue({ success: true })

        const response = await NotificationService.delete(1)

        expect(notificationsApi.deleteNotification).toHaveBeenCalledWith(1)
        expect(response.success).toBe(true)
    })

    it('should show toast notification', () => {
        const newNotification = { title: 'Test Title', message: 'Test Message' }

        NotificationService.showToast(newNotification, 'success')

        expect(toast).toHaveBeenCalled()
    })

    it('should handle WebSocket connection and disconnection', () => {
        const mockSocket = {
            readyState: WebSocket.CONNECTING,
            close: jest.fn(),
        }

        global.WebSocket = jest.fn(() => mockSocket)

        NotificationService.connect()
        expect(mockSocket.readyState).toBe(WebSocket.CONNECTING)

        NotificationService.disconnect()
        expect(mockSocket.close).toHaveBeenCalled()
    })

    it('should receive a WebSocket message and trigger notifications', () => {
        const mockSocket = {
            readyState: WebSocket.OPEN,
            onmessage: null,
        }

        global.WebSocket = jest.fn(() => mockSocket)

        NotificationService.connect()

        const notificationData = JSON.stringify({ title: 'Test Push', message: 'Test Message', important: true, url: 'http://example.com' })

        mockSocket.onmessage({ data: notificationData })

        expect(toast).toHaveBeenCalled()
        expect(Push.create).toHaveBeenCalledWith('Test Push', expect.any(Object))
    })

    it('should add and remove listeners correctly', () => {
        const listener = jest.fn()

        NotificationService.addListener(listener)
        expect(NotificationService.listeners.includes(listener)).toBe(true)

        NotificationService.removeListener(listener)
        expect(NotificationService.listeners.includes(listener)).toBe(false)
    })

    it('should notify listeners when receiving a notification', () => {
        const listener = jest.fn()
        NotificationService.addListener(listener)

        const newNotification = { title: 'Test Title', message: 'Test Message' }
        NotificationService.notifyListeners(newNotification)

        expect(listener).toHaveBeenCalledWith(newNotification)
    })
})