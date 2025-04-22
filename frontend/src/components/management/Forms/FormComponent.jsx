import PropTypes from 'prop-types'
import datatypes from '../../../consts/datatypes'
import { useForm, useFormParams } from '../../../hooks/management/useForm'
import { EvidenceForm, ReadOnlyEvidenceForm } from './EvidenceForms'
import { RequestForm, ReadOnlyRequestForm } from './RequestForms'
import { DefenseTribunalForm, ReadOnlyDefenseTribunalForm } from './DefenseTribunalForms'
import { DefenseActForm, ReadOnlyDefenseActForm } from './DefenseActForms'
import ReadOnlyUserForm from './Users/ReadOnlyUserForm'
import UserForm from './Users/UserForm'

const FormComponent = ({formParams}) => {
    const datatype = formParams?.datatype
    const idData = formParams?.idData
    const relatedUserId = formParams?.relatedUserId
    const view = formParams?.view

    const { loading, prevValues, handleSubmit } = useForm(datatype, idData, relatedUserId)

    const { closeManageForm } = useFormParams(datatype)

    if (loading) return null

    let specificForm

    switch (datatype) {
        case datatypes.evidence:
            specificForm = view?
                <ReadOnlyEvidenceForm 
                    closeModal={closeManageForm} 
                    prevValues={prevValues}
                    /> 
                : 
                <EvidenceForm 
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break 
        case datatypes.request:
            specificForm = view?
                <ReadOnlyRequestForm
                    closeModal={closeManageForm} 
                    prevValues={prevValues}
                    />
                :
                <RequestForm
                    closeModal={closeManageForm} 
                    prevValues={prevValues}
                    handleSubmit={handleSubmit} 
                    />
            break
        case datatypes.defense_tribunal:    
            specificForm = view?
                <ReadOnlyDefenseTribunalForm 
                    closeModal={closeManageForm} 
                    prevValues={prevValues}/>
                :
                <DefenseTribunalForm 
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
                    closeModal={closeManageForm} 
                    prevValues={prevValues}
                    />
                :
                <DefenseActForm 
                    closeModal={closeManageForm} 
                    prevValues={prevValues} 
                    handleSubmit={handleSubmit} 
                    />
            break
        case datatypes.user.professor:
        case datatypes.user.student:
            specificForm = view?
                <ReadOnlyUserForm 
                    closeModal={closeManageForm} 
                    prevValues={prevValues}
                    />
                :
                <UserForm 
                    datatype={datatype} 
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