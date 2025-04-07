
import datatypes from "../../../js-files/Datatypes"
import { useDropPopup } from "../../../hooks/common/usePopup"
import useForm from "../../../hooks/management/useForm"
import { EvidenceForm, ReadOnlyEvidenceForm } from "./EvidenceForms"
import { RequestForm, ReadOnlyRequestForm } from "./RequestForms"
import { DefenseTribunalForm, ReadOnlyDefenseTribunalForm } from "./DefenseTribunalForms"
import { DefenseActForm, ReadOnlyDefenseActForm } from "./DefenseActForms"
import { UserForm, ReadOnlyUserForm } from "./UserForms"

const FormComponent = ({formParams}) => {
    const datatype = formParams.datatype
    const idData = formParams.idData
    const view = formParams.view

    const { prevValues, handleSubmit } = useForm(datatype, idData)

    const popupId = 'form-popup'
    const { 
        openerRef,
        dropPopupRef,
        isVisible,
        toggleVisible,
    } = useDropPopup(popupId)

    const params = {
        values: {
            prevValues, 
            openerRef, 
            dropPopupRef, 
            isVisible
        },
        functions: {
            handleSubmit,
            toggleVisible
        } 
    }

    let specificForm

    switch (datatype) {
        case datatypes.evidence:
            specificForm = view?
                <ReadOnlyEvidenceForm prevValues={prevValues}/> 
                : 
                <EvidenceForm values={params.values} functions={params.functions}/>
            break 
        case datatypes.request:
            specificForm = view?
                <ReadOnlyRequestForm prevValues={prevValues}/>
                :
                <RequestForm values={params.values} functions={params.functions}/>
            break
        case datatypes.defense_tribunal:    
            specificForm = view?
                <ReadOnlyDefenseTribunalForm prevValues={prevValues}/>
                :
                <DefenseTribunalForm values={params.values} functions={params.functions}/>
            break
        // case datatypes.tribunal:
        //     children = <TribunalAprovalForm values={params.values} functions={params.functions}/>
        //     break
        case datatypes.defense_act:    
            specificForm = view?
                <ReadOnlyDefenseActForm prevValues={prevValues}/>
                :
                <DefenseActForm values={params.values} functions={params.functions}/>
            break
            case datatypes.user.professor:
            case datatypes.user.student:
                specificForm = view?
                    <ReadOnlyUserForm prevValues={prevValues}/>
                    :
                    <UserForm datatype={datatype} values={params.values} functions={params.functions}/>
            break
            default:
                console.warn(`El tipo de dato ${datatype} no coincide con ningun formulario configurado.`);
                break
    }
    return specificForm
}

export default FormComponent