import { useParams } from "react-router-dom"
import { DataForm } from "./Form"

const FormPage = () => {
    const { dataType, idData, onSubmit } = useParams()
    return (
        <DataForm dataType={dataType} idData={idData} onSubmit={onSubmit}></DataForm>
    )
}

export default FormPage