import eceApi from "../js-files/API"

const getUrl = (datatype, superId) => `/${datatype}/${superId ? `${superId}/` : ''}`

class ManagementService {
    async getAllData (datatype, superId) {
        if (!datatype) 
            throw new Error('Datatype is required')
    
        try {
            const response = await eceApi.get(getUrl(datatype, superId))
            return response.data
        } catch (error) {
            console.error('Error fetching all data:', error)
            throw error
        }
    }
    
    async getData (datatype, id, superId ) {
        if (!datatype || !id) 
            throw new Error('Datatype and id are required')
        
        try {
            const response = await eceApi.get(`${getUrl(datatype, superId)}`, {params: id})
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    }
    
    async createData (datatype, data, superId) {
        if (!datatype || !data) 
            throw new Error('Datatype and data are required')
        
        try {
            const response = await eceApi.post(getUrl(datatype, superId), data)
            return response.data
        } catch (error) {
            console.error('Error creating data:', error)
            throw error
        }
    }
    
    async updateData (datatype, id, data, superId) {
        if (!datatype || !id || !data) 
            throw new Error('Datatype, id and new data are required')
        
        try {
            const response = await eceApi.put(getUrl(datatype, superId), {params: id}, data)
            return response.data
        } catch (error) {
            console.error('Error updating data:', error)
            throw error
        }
    }
    
    async deleteData (datatype, id, superId) {
        if (!datatype || !id) 
            throw new Error('Datatype and id are required')
        
        try {
            const response = await eceApi.delete(getUrl(datatype, superId), {params: id})
            return response.data
        } catch (error) {
            console.error('Error deleting data:', error)
            throw error
        }
    }
}

export default new ManagementService