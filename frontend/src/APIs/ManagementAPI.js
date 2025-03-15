import axios from 'axios'

const managementApi = axios.create({
    baseURL: 'http://localhost:8000/management/',
})


const getUrl = (datatype, relatedUserId) => `${datatype}/${relatedUserId ? `${relatedUserId}/` : ''}`


export const getAllData = async (datatype, relatedUserId) => {
    if (!datatype) throw new Error('Datatype is required')
    
    try {
        const response = await managementApi.get(getUrl(datatype, relatedUserId))
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: " + error)
    }
}


export const getData = async (datatype, id, relatedUserId) => {
    if (!datatype || !id) throw new Error('Datatype and id are required')
    
    try {
        const response = await managementApi.get(getUrl(datatype, relatedUserId), { params: id })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: " + error)
    }
    
}


export const createData = async (datatype, data, relatedUserId) => {
    if (!datatype || !data) throw new Error('Datatype and data are required')
    
    try {
        const response = await managementApi.post(getUrl(datatype, relatedUserId), data)
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: ", error)
    }
    
}


export const updateData = async (datatype, id, data, relatedUserId) => {
    if (!datatype || !id || !data) throw new Error('Datatype, id and new data are required')
    
    try {
        const response = await managementApi.put(getUrl(datatype, relatedUserId), { params: id }, data)
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: ", error)
    }
    
}


export const deleteData = async (datatype, id, relatedUserId) => {
    if (!datatype || !id) throw new Error('Datatype and id are required')
    
    try {
        const response = await managementApi.delete(getUrl(datatype, relatedUserId), { params: id })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: ", error)
    }
    
}