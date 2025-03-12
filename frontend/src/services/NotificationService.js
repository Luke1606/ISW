class NotificationService {
    constructor(url) {
        this.url = url
        this.socket = null
        this.listeners = []
    }
  
    connect() {
        this.socket = new WebSocket(this.url)
  
        this.socket.onmessage = (event) => {
            const newNotification = JSON.parse(event.data)
            this.notifyListeners(newNotification)
        }
    }
  
    disconnect() {
        if (this.socket) {
            this.socket.close()
        }
    }
  
    addListener(callback) {
        this.listeners.push(callback);
    }
  
    removeListener(callback) {
        this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  
    notifyListeners(notification) {
        this.listeners.forEach((callback) => callback(notification))
    }
}

const baseURL = 'ws://localhost:8000/ws/notifications/'
  
export default new NotificationService(baseURL)