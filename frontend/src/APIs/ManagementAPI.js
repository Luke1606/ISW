import { createApiInstance } from './'
import { datatypes } from '@/data'

const managementApiInstance = createApiInstance('http://localhost:8000/management/')

const handleRequest = async (method, url, options = {}) => {
    let success = false
    let data = null
    let message
    try {
        const response = await managementApiInstance[method](url, options)
        if (response?.status === 200) {
            message = 'La operación se ejecutó correctamente'
            data = response?.data?.data
            success = true
        }
    } catch (error) {
        console.error('Error en la petición:', error)
        message = error.message || 'Error desconocido. Se está trabajando en la causa'
    }

    return {
        data,
        success,
        message
    }
}

const getAllData = (datatype, searchTerm, relatedUserId) =>
    handleRequest('get', `${datatype}/`, { params: { related_user_id: relatedUserId, search_term: searchTerm} })

const getData = (datatype, id, relatedUserId) =>
    handleRequest('get', `${datatype}/${id}/`, { params: { related_user_id: relatedUserId } })

const createData = (datatype, data) => {
    const formattedData = (
        datatype === datatypes.evidence || datatype === datatypes.defense_act? 
            fileTransform(data) 
            :
            data)
    handleRequest('post', `${datatype}/`, { formattedData })
}

const updateData = (datatype, id, data) => {
    const formattedData = (
        datatype === datatypes.evidence || datatype === datatypes.defense_act? 
            fileTransform(data) 
            :
            data)
    handleRequest('patch', `${datatype}/${id}/`, { formattedData })
}

const deleteData = (datatype, id) =>
    handleRequest('delete', `${datatype}/${id}/`)

const managementApi = {getAllData, getData, createData, updateData, deleteData}
export default managementApi

const fileTransform = (data) => {
    const formattedData = new FormData()

    for (const key in data)
        if (data[key])
            formattedData.append(key, data[key])
    return formattedData
}