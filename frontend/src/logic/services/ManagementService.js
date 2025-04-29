import {
    apiGetAllData, 
    apiGetData,
    apiDeleteData,
    apiCreateData,
    apiUpdateData
} from "../../APIs/ManagementAPI"

class ManagementService {
    async getAllData(datatype, searchTerm, relatedUserId) {
        return await apiGetAllData(datatype, searchTerm, relatedUserId)
    }
    
    async getData(datatype, id, relatedUserId) {
        return await apiGetData(datatype, id, relatedUserId)
    }
    
    async createData(datatype, data) {
        return await apiCreateData(datatype, data)
    }
    
    async updateData(datatype, id, data) {
        return await apiUpdateData(datatype, id, data)
    }
    
    async deleteData(datatype, id) {
        return await apiDeleteData(datatype, id)
    }
}

export default new ManagementService()