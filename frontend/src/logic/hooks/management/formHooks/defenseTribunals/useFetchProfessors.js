import { useState, useEffect } from 'react'
import { ManagementService, NotificationService } from '@/logic/services'
import { datatypes } from '@/data'

const useFetchProfessors = () => {
    const [ professors, setProfessors ] = useState([])
    
    useEffect(() => {
        const fetchProfessors = async () => {
            let message = ''
            let success = false
            try {
                const response = await ManagementService.getAllData(datatypes.user.professor)

                if (response.success) {
                    const profs = Object.values(response?.data?.data)
                        .flat().map(
                            professor => ({
                                value: professor.id,
                                label: professor.name
                            })
                        )
                    success = true
                    if (profs) 
                        setProfessors(profs)
                } else {
                    message = response?.message
                }
            } catch (error) {
                message = error.message
            } finally {
                if (!success) {
                    const notification = {
                        title: 'Error',
                        message: message
                    }
                    NotificationService.showToast(notification, 'error')
                }
            }
        }

        fetchProfessors()
    }, [])
    
    return professors
}

export default useFetchProfessors