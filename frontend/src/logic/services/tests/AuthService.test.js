/* eslint-disable no-undef */
import { authApi } from '@/APIs'
import { AuthService, NotificationService } from '@/logic'

// Simula `authApi` y `NotificationService`
jest.mock('@/APIs', () => ({
    authApi: {
        authenticate: jest.fn(),
        closeSession: jest.fn(),
        getSessionInfo: jest.fn(),
        changePassword: jest.fn(),
        isAboutToExpire: jest.fn(),
        setNewAccessToken: jest.fn()
    }
}))

jest.mock('@/services', () => ({
    NotificationService: {
        showToast: jest.fn()
    }
}))

describe('AuthService', () => {
    const userFormData = { username: 'testUser', password: 'testPass' }
    
    it('should call authenticate with correct parameters', async () => {
        authApi.authenticate.mockResolvedValue({ success: true, message: 'Login exitoso' })

        const response = await AuthService.login(userFormData)
        
        expect(authApi.authenticate).toHaveBeenCalledWith(userFormData)
        expect(response.success).toBe(true)
        expect(response.message).toBe('Login exitoso')
    })

    it('should handle login error', async () => {
        authApi.authenticate.mockResolvedValue({ success: false, message: 'Error de autenticación' })

        const response = await AuthService.login(userFormData)
        
        expect(authApi.authenticate).toHaveBeenCalledWith(userFormData)
        expect(response.success).toBe(false)
        expect(response.message).toBe('Error de autenticación')
    })

    it('should call logout and display the correct notification', async () => {
        authApi.closeSession.mockResolvedValue({ success: true, message: 'Sesión cerrada' })

        await AuthService.logout()

        expect(authApi.closeSession).toHaveBeenCalled()
        expect(NotificationService.showToast).toHaveBeenCalledWith(
            { title: 'Operación exitosa', message: 'Sesión cerrada' }, 'warning'
        )
    })

    it('should handle logout error', async () => {
        authApi.closeSession.mockResolvedValue({ success: false, message: 'Error al cerrar sesión' })

        await AuthService.logout()

        expect(authApi.closeSession).toHaveBeenCalled()
        expect(NotificationService.showToast).toHaveBeenCalledWith(
            { title: 'Cierre de sesión fallido', message: 'Error al cerrar sesión' }, 'error'
        )
    })

    it('should retrieve session info', async () => {
        authApi.getSessionInfo.mockResolvedValue({ user: 'testUser', role: 'admin' })

        const response = await AuthService.getSessionInfo()

        expect(authApi.getSessionInfo).toHaveBeenCalled()
        expect(response.user).toBe('testUser')
        expect(response.role).toBe('admin')
    })

    it('should update password correctly', async () => {
        authApi.changePassword.mockResolvedValue({ success: true })

        const response = await AuthService.changePassword(userFormData)

        expect(authApi.changePassword).toHaveBeenCalledWith(userFormData)
        expect(response.success).toBe(true)
    })

    it('should check authentication and refresh token if needed', async () => {
        authApi.isAboutToExpire.mockReturnValue(true)
        authApi.setNewAccessToken.mockResolvedValue({ success: true })

        const response = await AuthService.checkAuth()

        expect(authApi.isAboutToExpire).toHaveBeenCalled()
        expect(authApi.setNewAccessToken).toHaveBeenCalled()
        expect(response).toBe(true)
    })

    it('should check authentication without refreshing token', async () => {
        authApi.isAboutToExpire.mockReturnValue(false)

        const response = await AuthService.checkAuth()

        expect(authApi.isAboutToExpire).toHaveBeenCalled()
        expect(response).toBe(true)
    })

    it('should handle token refresh error', async () => {
        authApi.isAboutToExpire.mockReturnValue(true)
        authApi.setNewAccessToken.mockResolvedValue({ success: false })

        const response = await AuthService.checkAuth()

        expect(authApi.isAboutToExpire).toHaveBeenCalled()
        expect(authApi.setNewAccessToken).toHaveBeenCalled()
        expect(response).toBe(false)
    })
})