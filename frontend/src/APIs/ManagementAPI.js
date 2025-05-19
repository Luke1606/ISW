import { createApiInstance } from './'
import { datatypes } from '@/data'

const managementApiInstance = createApiInstance('http://localhost:8000/management/')

const handleRequest = async ({ method, url, data = null, params = {} }) => {
    let success = false
    let responseData = null
    let message = ''
    try {
        const response = data?
            await managementApiInstance[method](url, data, { params })
            :
            await managementApiInstance[method](url, { params })   

        if (response?.status >= 200 && response?.status < 300) {
            message = 'La operación se ejecutó correctamente'
            responseData = response?.data
            success = true
        }
    } catch (error) {
        console.error('Error en la petición:', error)
        message = error?.message || 'Error desconocido. Se está trabajando en la causa'
    }

    return {
        success,
        message,
        data: responseData
    }
}

const getAllData = async (datatype, searchTerm, relatedUserId) =>
    await handleRequest({
            method: 'get',
            url: `${datatype}/`,
            params: { related_user_id: relatedUserId, search_term: searchTerm}
        })

const getData = async (datatype, id, relatedUserId) => {
    const response = await handleRequest({
        method: 'get',
        url: `${datatype}/${id}/`, 
        params: { related_user_id: relatedUserId }
    })

    if (datatype === datatypes.evidence && response.data.attachment_type === 'file') {
        response.data.attachment_file = await fetchFileFromUrl(response.data.attachment_file)
    } else if (datatype === datatypes.defense_act) {
        response.data.attachment = await fetchFileFromUrl(response.data.attachment)
    }
    return response
}

const createData = async (datatype, data) => {
    const formattedData = (
        datatype === datatypes.evidence || datatype === datatypes.defense_act? 
            fileTransform(data) 
            :
            data)
    return await handleRequest({
        method: 'post', 
        url: `${datatype}/`,
        data: formattedData
    })
}

const updateData = async (datatype, id, data) => {
    const formattedData = (
        datatype === datatypes.evidence || datatype === datatypes.defense_act? 
            fileTransform(data) 
            :
            data)
    return await handleRequest({
        method: 'put', 
        url: `${datatype}/${id}/`,
        data: formattedData
    })
}

const deleteData = (datatype, ids) =>
    handleRequest({
        method: 'delete',
        url: `${datatype}/`,
        data: { data: { ids } }
    })

const managementApi = { 
    getAllData, 
    getData, 
    createData, 
    updateData,
    deleteData,
}
export default managementApi

const fileTransform = (data) => {
    const formattedData = new FormData()

    for (const key in data){
        if (data[key])
            formattedData.append(key, data[key])
    }
    return formattedData
}

const fetchFileFromUrl = async (url) => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], 'archivo_adjuntado', { type: blob.type })
}