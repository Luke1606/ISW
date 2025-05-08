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
} from '.'

const Form = () => {
    const { manageFormParams, closeManageForm, formModalId } = useFormParams()

    const datatype = manageFormParams?.datatype
    const idData = manageFormParams?.idData
    const relatedUserId = manageFormParams?.relatedUserId
    const view = manageFormParams?.view

    const { loading, prevValues, handleSubmit } = useForm(datatype, idData, relatedUserId)

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
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    values={prevValues}
                    /> 
                : 
                <EvidenceForm 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break 
        case datatypes.request:
            if (view) printError()

            specificForm = <RequestForm
                                modalId={formModalId}
                                closeModal={closeManageForm}
                                prevValues={prevValues}
                                handleSubmit={handleSubmit} 
                                />
            break
        case datatypes.tribunal:
        case datatypes.defense_tribunal:
            if (datatype===datatypes.tribunal && view) printError()
            else {
                specificForm = view?
                    <ReadOnlyDefenseTribunalForm 
                        modalId={formModalId}
                        closeModal={closeManageForm} 
                        values={prevValues}/>
                    :
                    <DefenseTribunalForm 
                        datatype={datatype}
                        modalId={formModalId}
                        closeModal={closeManageForm}
                        prevValues={prevValues} 
                        handleSubmit={handleSubmit} 
                        />
            }
            break
        case datatypes.defense_act:    
            specificForm = view?
                <ReadOnlyDefenseActForm 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    values={prevValues}
                    />
                :
                <DefenseActForm 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break
        case datatypes.user.professor:
        case datatypes.user.student:
            specificForm = view?
                <ReadOnlyUserForm 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    values={prevValues}
                    />
                :
                <UserForm 
                    isStudent={datatype===datatypes.user.student} 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break
        default:
            console.warn(`El tipo de dato ${datatype} no coincide con ningun formulario configurado.`)
            break
    }

    return specificForm
}

Form.propTypes = {
    formParams: PropTypes.shape({
        datatype: PropTypes.oneOf([
            ...Object.values(datatypes.user),
            datatypes.report,
            datatypes.request,
            datatypes.tribunal,
            datatypes.evidence,
            datatypes.defense_act,
            datatypes.defense_tribunal
        ]).isRequired,
        idData: PropTypes.string,
        relatedUserId: PropTypes.string,
        view: PropTypes.bool,
    }),
}

export default Form