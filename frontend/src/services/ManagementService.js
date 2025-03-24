import {
    apiGetAllData, 
    apiGetData,
    apiDeleteData,
    apiCreateData,
    apiUpdateData
} from "../APIs/ManagementAPI"

class ManagementService {
    async getAllData(datatype, searchTerm, relatedUserId) {
        return await apiGetAllData(datatype, searchTerm, relatedUserId)
    }
    
    async getData(datatype, id, relatedUserId) {
        return await apiGetData(datatype, id, relatedUserId)
    }
    
    async createData(datatype, data, relatedUserId) {
        return await apiCreateData(datatype, data, relatedUserId)
    }
    
    async updateData(datatype, id, data, relatedUserId) {
        return await apiUpdateData(datatype, id, data, relatedUserId)
    }
    
    async deleteData(datatype, id, relatedUserId) {
        return await apiDeleteData(datatype, id, relatedUserId)
    }
}

export default new ManagementService()