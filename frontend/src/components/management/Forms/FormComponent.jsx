/* eslint-disable react/prop-types */

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

    const { loading, prevValues, handleSubmit } = useForm(datatype, idData)

    const popupId = 'form-popup'
    const { 
        openerRef,
        dropPopupRef,
        isVisible,
        toggleVisible,
    } = useDropPopup(popupId)

    const values = {
            prevValues, 
            openerRef, 
            dropPopupRef, 
            isVisible
    }
    
    const functions = {
        handleSubmit,
        toggleVisible
    }

    if (loading) {
        return <span className="spinner"/>
    }


    let specificForm

    switch (datatype) {
        case datatypes.evidence:
            specificForm = view?
                <ReadOnlyEvidenceForm prevValues={prevValues}/> 
                : 
                <EvidenceForm values={values} functions={functions}/>
            break 
        case datatypes.request:
            specificForm = view?
                <ReadOnlyRequestForm prevValues={prevValues}/>
                :
                <RequestForm values={values} functions={functions}/>
            break
        case datatypes.defense_tribunal:    
            specificForm = view?
                <ReadOnlyDefenseTribunalForm prevValues={prevValues}/>
                :
                <DefenseTribunalForm values={values} functions={functions}/>
            break
        // case datatypes.tribunal:
        //     children = <TribunalAprovalForm values={params.values} functions={params.functions}/>
        //     break
        case datatypes.defense_act:    
            specificForm = view?
                <ReadOnlyDefenseActForm prevValues={prevValues}/>
                :
                <DefenseActForm values={values} functions={functions}/>
            break
            case datatypes.user.professor:
            case datatypes.user.student:
                specificForm = view?
                    <ReadOnlyUserForm prevValues={prevValues}/>
                    :
                    <UserForm values={values} functions={functions}/>
            break
            default:
                console.warn(`El tipo de dato ${datatype} no coincide con ningun formulario configurado.`);
                break
    }
    return specificForm
}

export default FormComponent