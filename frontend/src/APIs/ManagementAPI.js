import { createApiInstance } from "./APIConfig"

const managementApi = createApiInstance("http://localhost:8000/management/")

export const getAllData = async (datatype, relatedUserId) => {
    if (!datatype) throw new Error('Datatype is required')
    
    try {
        const response = await managementApi.get(`${datatype}/`, { params:{ related_user_id: relatedUserId } })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: " + error)
    }
}


export const getData = async (datatype, id, relatedUserId) => {
    if (!datatype || !id) throw new Error('Datatype and id are required')
    
    try {
        const response = await managementApi.get(`${datatype}/`, { params:{ related_user_id: relatedUserId, id: id } })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: " + error)
    }
    
}


export const createData = async (datatype, data, relatedUserId) => {
    if (!datatype || !data) throw new Error('Datatype and data are required')
    
    try {
        const response = await managementApi.post(`${datatype}/`, { params:{ related_user_id: relatedUserId, data: data } })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: ", error)
    }
}


export const updateData = async (datatype, id, data, relatedUserId) => {
    if (!datatype || !id || !data) throw new Error('Datatype, id and new data are required')
    
    try {
        const response = await managementApi.put(`${datatype}/`, { params:{ related_user_id: relatedUserId, id: id, data: data } })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: ", error)
    }
    
}


export const deleteData = async (datatype, id, relatedUserId) => {
    if (!datatype || !id) throw new Error('Datatype and id are required')
    
    try {
        const response = await managementApi.delete(`${datatype}/`, { params:{ related_user_id: relatedUserId, id: id } })
        return response.data    
    } catch (error) {
        throw new Error("Error en la petición: ", error)
    }
    
}

export default managementApi