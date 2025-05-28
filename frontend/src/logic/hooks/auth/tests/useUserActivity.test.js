/* eslint-disable no-undef */
import { renderHook, act } from '@testing-library/react-hooks'
import { useAuth, useUserActivity } from '@/logic'

jest.mock('@/logic', () => ({
    useAuth: jest.fn(() => ({
        logout: jest.fn(),
        isAuthorized: true
    }))
}))

describe('useUserActivity', () => {
    beforeEach(() => {
        jest.useFakeTimers() // Simula temporizador para pruebas más controladas
    })

    afterEach(() => {
        jest.useRealTimers() // Restaura temporizador real
    })

    it('should start monitoring user activity when authorized', () => {
        const { result } = renderHook(() => useUserActivity())

        expect(result.current).toBeUndefined() // El hook no devuelve valores explícitos
    })

    it('should trigger logout after inactivity', async () => {
        const { result } = renderHook(() => useUserActivity(5000)) // Reducimos tiempo de inactividad para pruebas rápidas
        const { logout } = useAuth()

        act(() => {
            jest.advanceTimersByTime(5000) // Simula 5s de inactividad
        })

        expect(logout).toHaveBeenCalled()
    })

    it('should reset inactivity timer on user events', () => {
        const { result } = renderHook(() => useUserActivity(5000))

        act(() => {
            window.dispatchEvent(new Event('mousemove')) // Simula actividad de usuario
            jest.advanceTimersByTime(3000) // Pasan 3s, pero debería reiniciar el temporizador
        })

        expect(useAuth().logout).not.toHaveBeenCalled() // Logout no debe ejecutarse aún
        act(() => {
            jest.advanceTimersByTime(5000) // Ahora sí pasan los 5s completos
        })

        expect(useAuth().logout).toHaveBeenCalled()
    })

    it('should clean up event listeners when unmounted', () => {
        const { unmount } = renderHook(() => useUserActivity())

        unmount() // Simula desmontaje del componente

        act(() => {
            window.dispatchEvent(new Event('mousemove')) // No debería reiniciar el timeout
            jest.advanceTimersByTime(5000)
        })

        expect(useAuth().logout).not.toHaveBeenCalled() // El hook ya no debería reaccionar
    })
})