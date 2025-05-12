import { managementApi } from '@/APIs'

class ManagementService {
    async getAllData(datatype, searchTerm, relatedUserId) {
        return await managementApi.getAllData(datatype, searchTerm, relatedUserId)
    }
    
    async getData(datatype, id, relatedUserId) {
        return await managementApi.getData(datatype, id, relatedUserId)
    }
    
    async createData(datatype, data) {
        return await managementApi.createData(datatype, data)
    }
    
    async updateData(datatype, id, data) {
        return await managementApi.updateData(datatype, id, data)
    }
    
    async deleteData(datatype, ids) {
        return await managementApi.deleteData(datatype, ids)
    }
}

export default new ManagementService()