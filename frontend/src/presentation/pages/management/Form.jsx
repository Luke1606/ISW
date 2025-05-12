import PropTypes from 'prop-types'
import { datatypes } from '@/data'
import { useForm, useFormParams } from '@/logic'
import { 
    UserForm,
    RequestForm,
    EvidenceForm, 
    DefenseActForm,
    ReadOnlyUserForm,
    DefenseTribunalForm, 
    ReadOnlyEvidenceForm,
    ReadOnlyDefenseActForm,
    ReadOnlyDefenseTribunalForm
} from './'

const Form = ({ reloadFunction }) => {
    const { manageFormParams, closeManageForm } = useFormParams()

    const closeForm = () => {
        closeManageForm()
        reloadFunction(true)
    }

    const datatype = manageFormParams?.datatype
    const idData = manageFormParams?.idData
    const relatedUserId = manageFormParams?.relatedUserId
    const view = manageFormParams?.view
    
    const { loading, prevValues, isEdition } = useForm(datatype, idData, relatedUserId)
    
    if (loading || !manageFormParams) return null

    let specificForm

    const printError = () => {
        console.warn('Función no permitida.')
        return null
    }

    switch (datatype) {
        case datatypes.evidence:
            specificForm = view?
                <ReadOnlyEvidenceForm 
                    closeFunc={closeForm} 
                    values={prevValues}
                    /> 
                : 
                <EvidenceForm 
                    idEdition={isEdition} 
                    closeFunc={closeForm}
                    studentId={relatedUserId}
                    prevValues={prevValues} 
                    />
            break 
        case datatypes.request:
            if (view) printError()

            specificForm = <RequestForm
                                closeFunc={closeForm}
                                studentId={relatedUserId}
                                prevValues={prevValues}
                                isEdition={isEdition}
                                />
            break
        case datatypes.tribunal:
        case datatypes.defense_tribunal:
            if (datatype===datatypes.tribunal && view) printError()
            else {
                specificForm = view?
                    <ReadOnlyDefenseTribunalForm 
                        closeFunc={closeForm} 
                        values={prevValues}/>
                    :
                    <DefenseTribunalForm 
                        datatype={datatype}
                        closeFunc={closeForm}
                        prevValues={prevValues}
                        isEdition={isEdition}
                        />
            }
            break
        case datatypes.defense_act:    
            specificForm = view?
                <ReadOnlyDefenseActForm 
                    closeFunc={closeForm} 
                    values={prevValues}
                    />
                :
                <DefenseActForm 
                    closeFunc={closeForm} 
                    studentId={relatedUserId}
                    prevValues={prevValues} 
                    isEdition={isEdition} 
                    />
            break
        case datatypes.user.professor:
        case datatypes.user.student:
            specificForm = view?
                <ReadOnlyUserForm 
                    closeFunc={closeForm} 
                    values={prevValues}
                    />
                :
                <UserForm 
                    isStudent={datatype===datatypes.user.student} 
                    closeFunc={closeForm} 
                    prevValues={prevValues} 
                    isEdition={isEdition} 
                    />
            break
        default:
            console.warn(`El tipo de dato ${datatype} no coincide con ningun formulario configurado.`)
            break
    }

    return specificForm
}

Form.propTypes = {
    reloadFunction: PropTypes.func.isRequired,
}

export default Form