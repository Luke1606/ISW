import * as managementApi from "../APIs/ManagementAPI"

class ManagementService {
    async fetchData(datatype, searchTerm, relatedUserId) {
        return await managementApi.getAllData(datatype, searchTerm, relatedUserId)
    }
    
    async getData(datatype, id, relatedUserId) {
        return await managementApi.getData(datatype, id, relatedUserId)
    }
    
    async createData(datatype, data, relatedUserId) {
        return await managementApi.createData(datatype, data, relatedUserId)
    }
    
    async updateData(datatype, id, data, relatedUserId) {
        return await managementApi.updateData(datatype, id, data, relatedUserId)
    }
    
    async deleteData(datatype, id, relatedUserId) {
        return await managementApi.deleteData(datatype, id, relatedUserId)
    }
}

export default new ManagementService();