import { useState, useEffect } from "react"
import { ManagementService, NotificationService } from "@/logic"
import { datatypes } from "@/data"

const useAuthorName = (shouldFetch, values) => {
    const [ authorName, setAuthorName ] = useState('')
    
        useEffect(() => {
            const fetchAuthor = async () => {
                let message = ''
                let success = false
                try {
                    const response = await ManagementService.getData(datatypes.user.professor, values?.author)
    
                    if (response.success) {
                        success = true
                        setAuthorName(response.data.id.name)
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
    
            if (shouldFetch) {
                fetchAuthor()
            }
        }, [ shouldFetch, values ])

        return authorName
}

export default useAuthorName