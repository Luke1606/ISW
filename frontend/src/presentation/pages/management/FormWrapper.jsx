import PropTypes from 'prop-types'
import { datatypes } from '@/data'
import { useAuth, useForm, useFormParams, useLoading } from '@/logic'
import { 
    UserForm,
    ReportForm,
    RequestForm,
    EvidenceForm, 
    DefenseActForm,
    ReadOnlyUserForm,
    DefenseTribunalForm, 
    ReadOnlyEvidenceForm,
    ReadOnlyDefenseActForm,
    ReadOnlyDefenseTribunalForm
} from '.'

const FormWrapper = ({ reloadFunction }) => {
    const { manageFormParams, closeManageForm } = useFormParams()

    const closeForm = () => {
        reloadFunction(true)
        closeManageForm()
    }
    
    const { 
        view ,
        idData,
        datatype,
        relatedUserId
    } = manageFormParams
    
    const { loading } = useLoading()

    const { prevValues, isEdition } = useForm(datatype, idData, relatedUserId)

    const { user } = useAuth()

    if (loading || !manageFormParams || prevValues === null) return null

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
                    isEdition={isEdition}
                    closeFunc={closeForm}
                    studentId={relatedUserId}
                    prevValues={prevValues} 
                    />
            break 
        case datatypes.request:
            if (view) printError()

            specificForm = <RequestForm
                                closeFunc={closeForm}
                                prevValues={prevValues}
                                isEdition={isEdition}
                                />
            break
        case datatypes.defense_tribunal:
            specificForm = view?
                <ReadOnlyDefenseTribunalForm 
                    closeFunc={closeForm} 
                    values={prevValues}/>
                :
                <DefenseTribunalForm 
                    isDefenseTribunal={user.user_role !== datatypes.user.decan}
                    datatype={datatype}
                    closeFunc={closeForm}
                    prevValues={prevValues}
                    />
            break
        case datatypes.defense_act:    
            specificForm = view?
                <ReadOnlyDefenseActForm 
                    closeFunc={closeForm} 
                    values={prevValues}
                    />
                :
                <DefenseActForm 
                    isEdition={isEdition} 
                    closeFunc={closeForm} 
                    studentId={relatedUserId}
                    prevValues={prevValues} 
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
                    isEdition={isEdition} 
                    closeFunc={closeForm} 
                    isStudent={datatype===datatypes.user.student} 
                    prevValues={prevValues} 
                    />
            break
        case datatypes.report:
            specificForm = view?
                printError()
                :
                <ReportForm
                    closeFunc={closeForm} 
                    />
            break
        default:
            console.warn(`El tipo de dato ${datatype} no coincide con ningun formulario configurado.`)
            break
    }

    return specificForm
}

FormWrapper.propTypes = {
    reloadFunction: PropTypes.func.isRequired,
}

export default FormWrapper