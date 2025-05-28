/* eslint-disable no-undef */
import { ManagementService } from '@/logic'
import { managementApi } from '@/APIs'

// Simula la API externa
jest.mock('@/APIs', () => ({
    managementApi: {
        getAllData: jest.fn(),
        getData: jest.fn(),
        createData: jest.fn(),
        updateData: jest.fn(),
        deleteData: jest.fn(),
        generateReport: jest.fn()
    }
}));

describe('ManagementService', () => {
    const datatype = 'testType'
    const searchTerm = 'testSearch'
    const relatedUserId = 123
    const id = 1
    const data = { key: 'value' }
    const ids = [1, 2, 3]

    it('should call getAllData with correct parameters', async () => {
        await ManagementService.getAllData(datatype, searchTerm, relatedUserId)
        expect(managementApi.getAllData).toHaveBeenCalledWith(datatype, searchTerm, relatedUserId)
    })

    it('should call getData with correct parameters', async () => {
        await ManagementService.getData(datatype, id, relatedUserId)
        expect(managementApi.getData).toHaveBeenCalledWith(datatype, id, relatedUserId)
    })

    it('should call createData with correct parameters', async () => {
        await ManagementService.createData(datatype, data)
        expect(managementApi.createData).toHaveBeenCalledWith(datatype, data)
    });

    it('should call updateData with correct parameters', async () => {
        await ManagementService.updateData(datatype, id, data)
        expect(managementApi.updateData).toHaveBeenCalledWith(datatype, id, data)
    });

    it('should call deleteData with correct parameters', async () => {
        await ManagementService.deleteData(datatype, ids)
        expect(managementApi.deleteData).toHaveBeenCalledWith(datatype, ids)
    });

    it('should call generateReport with correct parameters', async () => {
        await ManagementService.generateReport(data);
        expect(managementApi.generateReport).toHaveBeenCalledWith(data)
    })
})