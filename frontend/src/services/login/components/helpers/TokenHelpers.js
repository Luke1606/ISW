import jwtDecode from "jwt-decode"
import eceApi from "../../../management/components/helpers/APIHelpers"

export const setToken = (TOKEN_KEY, token) => localStorage.setItem(TOKEN_KEY, token)

export const getToken = (TOKEN_KEY) => localStorage.getItem(TOKEN_KEY)

export const deleteToken = (TOKEN_KEY) => localStorage.removeItem(TOKEN_KEY)

export const getNewAccessToken = async (refreshToken) => await eceApi.post('/token/refresh/', { refresh: refreshToken })

export const isAboutToExpire = (token, threshold = 300) => {
    const decoded = jwtDecode(token)
    const tokenExpiration = decoded.exp
    const now = Date.now() / 1000
    return (tokenExpiration - now) < threshold
}