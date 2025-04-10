import { createApiInstance } from "./APIConfig"

const managementApi = createApiInstance("http://localhost:8000/management/")

const handleRequest = async (method, url, options = {}) => {
    try {
        const response = await managementApi[method](url, options)
        return response.data
    } catch (error) {
        throw new Error(error.message || "Error desconocido. Se está trabajando en la causa")
    }
}

export const apiGetAllData = (datatype, searchTerm, relatedUserId) =>
    handleRequest('get', `${datatype}/`, { params: { related_user_id: relatedUserId, search_term: searchTerm} })

export const apiGetData = (datatype, id, relatedUserId) =>
    handleRequest('get', `${datatype}/${id}/`, { params: { related_user_id: relatedUserId } })

export const apiCreateData = (datatype, data) =>
    handleRequest('post', `${datatype}/`, { data })

export const apiUpdateData = (datatype, id, data) =>
    handleRequest('patch', `${datatype}/${id}/`, { data })

export const apiDeleteData = (datatype, id) =>
    handleRequest('delete', `${datatype}/${id}/`)