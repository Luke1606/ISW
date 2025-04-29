import PropTypes from 'prop-types'
import datatypes from '../../../data/datatypes'
import { useForm, useFormParams } from '../../../logic/hooks/management/useForm'
import { EvidenceForm, ReadOnlyEvidenceForm } from './Forms/evidences/EvidenceForms'
import { RequestForm, ReadOnlyRequestForm } from './Forms/requests/RequestForms'
import { DefenseTribunalForm, ReadOnlyDefenseTribunalForm } from './Forms/defenseTribunals/DefenseTribunalForms'
import DefenseActForm from './Forms/defenseActs/DefenseActForm'
import ReadOnlyDefenseActForm from './Forms/defenseActs/ReadOnlyDefenseActForm'
import ReadOnlyUserForm from './forms/users/ReadOnlyUserForm'
import UserForm from './forms/users/UserForm'

const FormComponent = ({formParams}) => {
    const datatype = formParams?.datatype
    const idData = formParams?.idData
    const relatedUserId = formParams?.relatedUserId
    const view = formParams?.view

    const { loading, prevValues, handleSubmit } = useForm(datatype, idData, relatedUserId)

    const { closeManageForm, formModalId } = useFormParams(datatype)
    
    if (loading) return null

    let specificForm

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
            specificForm = view?
                <ReadOnlyRequestForm
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    values={prevValues}
                    />
                :
                <RequestForm
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    prevValues={prevValues}
                    handleSubmit={handleSubmit} 
                    />
            break
        case datatypes.defense_tribunal:    
            specificForm = view?
                <ReadOnlyDefenseTribunalForm 
                    modalId={formModalId}
                    closeModal={closeManageForm} 
                    values={prevValues}/>
                :
                <DefenseTribunalForm 
                modalId={formModalId}
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break
        // case datatypes.tribunal:
        //     children = <TribunalAprovalForm values={params.values} functions={params.functions}/>
        //     break
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

FormComponent.propTypes = {
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

export default FormComponent