
import { useParams } from "react-router-dom"
import datatypes from "../../../js-files/Datatypes"
import { useDropPopup } from "../../../hooks/common/usePopup"
import useForm from "../../../hooks/management/useForm"
import { EvidenceForm, ReadOnlyEvidenceForm } from "./EvidenceForms"
import { RequestForm, ReadOnlyRequestForm } from "./RequestForms"
import { DefenseTribunalForm, ReadOnlyDefenseTribunalForm } from "./DefenseTribunalForms"
import { DefenseActForm, ReadOnlyDefenseActForm } from "./DefenseActForms"
import { UserForm, ReadOnlyUserForm } from "./UserForms"


const FormComponent = () => {
    const { dataType, idData, readOnly }= useParams()
    const { prevValues, handleSubmit } = useForm(dataType, idData, ) 
    
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

    let children

    switch (dataType) {
        case datatypes.evidence:
            children = readOnly? 
                <ReadOnlyEvidenceForm prevValues={prevValues}/> 
                : 
                <EvidenceForm values={params.values} functions={params.functions}/>
            break 
        case datatypes.request:
            children = readOnly?
                <ReadOnlyRequestForm prevValues={prevValues}/>
                :
                <RequestForm values={params.values} functions={params.functions}/>
            break
        case datatypes.defense_tribunal:    
            children = readOnly?
                <ReadOnlyDefenseTribunalForm prevValues={prevValues}/>
                :
                <DefenseTribunalForm values={params.values} functions={params.functions}/>
            break
        // case datatypes.tribunal:
        //     children = readOnly?
        //         <ReadOnlyDefenseActForm prevValues={prevValues}/>
        //         :
        //         <TribunalAprovalForm values={params.values} functions={params.functions}/>
        //     break
        case datatypes.defense_act:    
            children = readOnly?
                <ReadOnlyDefenseActForm prevValues={prevValues}/>
                :
                <DefenseActForm values={params.values} functions={params.functions}/>
            break
        case datatypes.professor || datatypes.student:
            children = readOnly?
                <ReadOnlyUserForm dataType={dataType} prevValues={prevValues}/>
                :
                <UserForm datatype={dataType} values={params.values} functions={params.functions}/>
            break
    }
    return (
        <div className="manage-container">
            {children}
        </div>
    )
}

export default FormComponent