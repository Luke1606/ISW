import { createApiInstance } from "./APIConfig"

const managementApi = createApiInstance("http://localhost:8000/management/")

const handleRequest = async (method, url, options = {}) => {
    try {
        const response = await managementApi[method](url, options)
        return response.data
    } catch (error) {
        const errorStatus = error.request.status
        const errorHeader = error.request.statusText
        const errorMessage = error.response.data.error
        throw new Error(`${errorStatus} ${errorHeader}: ${errorMessage}`)
    }
}

export const apiGetAllData = (datatype, searchTerm, relatedUserId) =>
    handleRequest('get', `${datatype}/`, { params: { related_user_id: relatedUserId, search_term: searchTerm} })

export const apiGetData = (datatype, id, relatedUserId) =>
    handleRequest('get', `${datatype}/${id}/`, { params: { related_user_id: relatedUserId } })

export const apiCreateData = (datatype, data, relatedUserId) =>
    handleRequest('post', `${datatype}/`, { data, params: { related_user_id: relatedUserId } })

export const apiUpdateData = (datatype, id, data, relatedUserId) =>
    handleRequest('put', `${datatype}/${id}/`, { data, params: { related_user_id: relatedUserId } })

export const apiDeleteData = (datatype, id, relatedUserId) =>
    handleRequest('delete', `${datatype}/${id}/`, { params: { related_user_id: relatedUserId } })