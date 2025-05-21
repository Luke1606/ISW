import { useParams } from 'react-router-dom'
import { useState } from 'react'
import List from './List'
import { datatypes } from '@/data'
import { useAuth } from '@/logic'

const ListWrapper = () => {
    const { user } = useAuth()
    const { datatype, relatedUserId } = useParams()

    // Estado para manejar el datatype actual
    const realDatatype = datatype === datatypes.user.defaultUser?
        datatypes.user.student
        :
        datatype

    const [currentDatatype, setCurrentDatatype] = useState(realDatatype)

    // Cambiar el datatype y actualizar la URL
    const handleChangeDatatype = (newDatatype) => {
        setCurrentDatatype(newDatatype)
    }

    return (
        <>
            {/* Opciones de categorías solo si el datatype es 'user' */}
            {datatype === datatypes.user.defaultUser && user?.user_role === datatypes.user.decan && (
                <div 
                    className='datatype-selector form-radio-container'
                    >
                    <span
                        className={`form-radio-option datatype-link ${currentDatatype === datatypes.user.professor ? 'active' : ''}`}
                        onClick={() => handleChangeDatatype(datatypes.user.professor)}
                        >
                        Gestionar Profesores
                    </span>

                    <span
                        className={`form-radio-option datatype-link ${currentDatatype === datatypes.user.student ? 'active' : ''}`}
                        onClick={() => handleChangeDatatype(datatypes.user.student)}
                        >
                        Gestionar Estudiantes
                    </span>
                </div>
            )}

            {/* Renderiza el componente List con el datatype actualizado */}
            <List datatype={currentDatatype} relatedUserId={relatedUserId} />
        </>
    )
}

export default ListWrapper