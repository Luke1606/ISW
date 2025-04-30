import PropTypes from 'prop-types'
import { datatypes } from '@/data'
import { useForm, useFormParams } from '@/logic'
import { 
    EvidenceForm, 
    ReadOnlyEvidenceForm,
    RequestForm,
    DefenseTribunalForm, 
    ReadOnlyDefenseTribunalForm,
    DefenseActForm,
    ReadOnlyDefenseActForm,
    UserForm,
    ReadOnlyUserForm
} from '.'

const Form = ({formParams}) => {
    const datatype = formParams?.datatype
    const idData = formParams?.idData
    const relatedUserId = formParams?.relatedUserId
    const view = formParams?.view

    const { loading, prevValues, handleSubmit } = useForm(datatype, idData, relatedUserId)

    const { closeManageForm, formModalId } = useFormParams(datatype)
    
    if (loading) return null

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
                    usertype={datatype} 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break
        default:
            console.warn(`El tipo de dato ${datatype} no coincide con ningun formulario configurado.`);
            break
    }
    return specificForm
}

Form.propTypes = {
    formParams: PropTypes.shape({
        datatype: PropTypes.oneOf([
            ...Object.values(datatypes.user),
            datatypes.evidence,
            datatypes.request,
            datatypes.defense_tribunal,
            datatypes.tribunal,
            datatypes.defense_act,
            datatypes.report
        ]).isRequired,
        idData: PropTypes.string,
        relatedUserId: PropTypes.string,
        view: PropTypes.bool,
    }),
}

export default Form