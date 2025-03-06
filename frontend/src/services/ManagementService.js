import * as managementApi from "../APIs/ManagementAPI"

class ManagementService {
    async fetchData(datatype, searchTerm, superId) {
        return await managementApi.getAllData(datatype, searchTerm, superId)
    }
    
    async getData(datatype, id, superId) {
        return await managementApi.getData(datatype, id, superId)
    }
    
    async createData(datatype, data, superId) {
        return await managementApi.createData(datatype, data, superId)
    }
    
    async updateData(datatype, id, data, superId) {
        return await managementApi.updateData(datatype, id, data, superId)
    }
    
    async deleteData(datatype, id, superId) {
        return await managementApi.deleteData(datatype, id, superId)
    }
}

export default new ManagementService();