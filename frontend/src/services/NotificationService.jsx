import { toast } from 'react-toastify'
import Push from 'push.js'
import { getNotifications, markNotificationAsRead, deleteNotification } from '../APIs/NotificationsAPI'

class NotificationService {
    constructor (url, maxReconnectAttempts) {
        this.url = url
        this.socket = null
        this.listeners = []
        this.isUserActive = true
        this.reconnectAttempts = 0
        this.maxReconnectAttempts = maxReconnectAttempts
    }

    setUserActive(active) {
        this.isUserActive = active
    }

    async get () {
        return await getNotifications()
    }

    async markAsRead (id) {
        return await markNotificationAsRead(id)
    }

    async delete (id) {
        return await deleteNotification(id)
    }

    showToast (newNotification, type='info') {
        toast(
            <div>
                <strong>{newNotification.title}</strong>
                <div>{newNotification.message}</div>
            </div>
        , {
            type: type,
        })
    }
  
    connect () {
        this.socket = new WebSocket(this.url)
        
        this.socket.onopen = () => {
            console.log('WebSocket conectado')
            this.reconnectAttempts = 0
        }
        
        this.socket.onerror = (error) => {
            console.error('Error del webSocket:', error)
        }
        
        this.socket.onclose = () => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                console.log(`WebSocket desconectado. Intentando reconectar (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`)
                this.reconnectAttempts++
                setTimeout(() => this.connect(), 3000); // Intentar reconectar tras 3 segundos
            } else {
                console.error('Se excedió el límite de intentos de reconexión. Por favor verifica el servidor.')
            }
        }
  
        this.socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data)

            this.notifyListeners(newNotification) // actualiza el centro de notificaciones

            if (this.isUserActive) { // Si el usuario está activo, muestra un toast
                this.showToast(newNotification)
            } else if (newNotification.important && Push.Permission.has()) { // Si es importante y el usuario no está activo, muestra una notificación Push
                const pushNotification = {
                    body: `${newNotification.message}`,
                    icon: '/icon.png',
                    timeout: 6000,
                    onClick: () => {
                        window.open(newNotification.url, '_blank')
                    }
                }

                Push.create(newNotification.title, pushNotification)
            } else 
                console.log('Push notifications are disabled by the user.')
        }            
    }
  
    disconnect () {
        if (this.socket) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.close()
                console.log('WebSocket desconectado exitosamente')
            } else {
                console.log('WebSocket ya estaba cerrado o no se pudo desconectar.')
            }
        }
    }
  
    addListener (callback) {
        this.listeners.push(callback)
    }
  
    removeListener (callback) {
        this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  
    notifyListeners (notification) {
        this.listeners.forEach((callback) => callback(notification))
    }
}

const baseURL = 'ws://localhost:8000/ws/notifications/'
  
export default new NotificationService(baseURL, 50)