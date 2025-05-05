import { createApiInstance } from './'

const managementApiInstance = createApiInstance('http://localhost:8000/management/')

const handleRequest = async (method, url, options = {}) => {
    try {
        const response = await managementApiInstance[method](url, options)
        return response.data
    } catch (error) {
        throw new Error(error.message || 'Error desconocido. Se está trabajando en la causa')
    }
}

const getAllData = (datatype, searchTerm, relatedUserId) =>
    handleRequest('get', `${datatype}/`, { params: { related_user_id: relatedUserId, search_term: searchTerm} })

const getData = (datatype, id, relatedUserId) =>
    handleRequest('get', `${datatype}/${id}/`, { params: { related_user_id: relatedUserId } })

const createData = (datatype, data) =>
    handleRequest('post', `${datatype}/`, { data })

const updateData = (datatype, id, data) =>
    handleRequest('patch', `${datatype}/${id}/`, { data })

const deleteData = (datatype, id) =>
    handleRequest('delete', `${datatype}/${id}/`)

const managementApi = {getAllData, getData, createData, updateData, deleteData}
export default managementApi