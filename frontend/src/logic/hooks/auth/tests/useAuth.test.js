/* eslint-disable no-undef */
import { renderHook } from '@testing-library/react-hooks'
import { AuthContext, AuthService, useLoading, useAuth } from '@/logic'

jest.mock('@/logic', () => ({
    AuthContext: {
        user: { username: 'testUser', role: 'admin' },
        login: jest.fn(),
        logout: jest.fn(),
        authStatusChanged: false
    },
    AuthService: {
        checkAuth: jest.fn()
    },
    useLoading: jest.fn(() => ({
        setLoading: jest.fn()
    }))
}))

describe('useAuth', () => {
    it('should initialize isAuthorized as null', () => {
        const { result } = renderHook(() => useAuth())

        expect(result.current.isAuthorized).toBe(null)
    })

    it('should verify authorization when mounted', async () => {
        AuthService.checkAuth.mockResolvedValue(true)

        const { result, waitForNextUpdate } = renderHook(() => useAuth())

        await waitForNextUpdate()

        expect(AuthService.checkAuth).toHaveBeenCalled()
        expect(result.current.isAuthorized).toBe(true)
    })

    it('should handle authorization errors', async () => {
        AuthService.checkAuth.mockRejectedValue(new Error('Auth error'))

        const { result, waitForNextUpdate } = renderHook(() => useAuth())

        await waitForNextUpdate()

        expect(AuthService.checkAuth).toHaveBeenCalled()
        expect(result.current.isAuthorized).toBe(false)
    })

    it('should trigger authorization check when authStatusChanged updates', async () => {
        AuthContext.authStatusChanged = true
        AuthService.checkAuth.mockResolvedValue(true)

        const { result, waitForNextUpdate } = renderHook(() => useAuth())

        await waitForNextUpdate()

        expect(AuthService.checkAuth).toHaveBeenCalled()
        expect(result.current.isAuthorized).toBe(true)
    })

    it('should return correct user data from context', () => {
        const { result } = renderHook(() => useAuth())

        expect(result.current.user).toEqual({ username: 'testUser', role: 'admin' })
    })

    it('should expose login and logout functions from context', () => {
        const { result } = renderHook(() => useAuth())

        expect(result.current.login).toBeInstanceOf(Function)
        expect(result.current.logout).toBeInstanceOf(Function)
    })
})