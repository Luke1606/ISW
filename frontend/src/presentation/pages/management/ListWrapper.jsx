import { useNavigate, useParams } from 'react-router-dom'
import { datatypes } from '@/data'
import { useAuth } from '@/logic'
import List from './List'

const ListWrapper = () => {
    const { user } = useAuth()
    const { datatype, relatedUserId } = useParams()
    const navigate = useNavigate()

    return (
        <>
            {/* Opciones de categorías solo si el datatype es 'user' */}
            {(datatype === datatypes.user.student || datatype === datatypes.user.professor) && 
                user?.user_role === datatypes.user.decan && 
                    <>
                        <div
                            className='datatype-selector form-radio-container'
                            >
                            <span
                                className={`form-radio-option datatype-link ${datatype === datatypes.user.professor ? 'active' : ''}`}
                                onClick={() => navigate(`/list/${datatypes.user.professor}`)}
                                >
                                Gestionar Profesores
                            </span>

                            <span
                                className={`form-radio-option datatype-link ${datatype === datatypes.user.student ? 'active' : ''}`}
                                onClick={() => navigate(`/list/${datatypes.user.student}`)}
                                >
                                Gestionar Estudiantes
                            </span>
                        </div>
                    </>}

            <List datatype={datatype} relatedUserId={relatedUserId} />
        </>
    )
}

export default ListWrapper