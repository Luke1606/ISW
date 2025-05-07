import PropTypes from 'prop-types'
import { useMemo, useRef } from 'react'
import * as Yup from 'yup'
import { datatypes } from '@/data'
import { ManagementService, useGenericForm } from '@/logic'
import { FilePreviewer, FormButtons, SearchableSelect } from '@/presentation'

const ReportForm = ({ modalId, closeModal, userRole }) => {
    const initialValues = {
        infoType: '',
        selectedElements: [],
        selectedElementsInfo: [],
    }

    const AVAILABLE_INFO_MAPPING = useMemo(() => {

    }, [userRole])

    const AVAILABLE_SUB_INFO_MAPPING = useMemo(() => {

    }, [AVAILABLE_INFO_MAPPING])

    const validationSchema = useMemo(() => Yup.object().shape({
        infoType: Yup.string()
            .required('La información a reportar es obligatoria')
            .oneOf(AVAILABLE_INFO_MAPPING),
        
        selectedElements: Yup.array()
            .of(Yup.ObjectSchema({
                id: Yup.string().required(),
                name: Yup.string().required(),
            })),
        
        selectedElementsInfo: Yup.array()
            .oneOf(AVAILABLE_SUB_INFO_MAPPING)
            .required('La información a reportar de los elementos seleccionados es obligatoria'),
    }), [AVAILABLE_INFO_MAPPING, AVAILABLE_SUB_INFO_MAPPING])

    const submitFunction = async (values) => {
        await ManagementService.generateReport(values)
    }

    const formik = useGenericForm(submitFunction, initialValues, validationSchema)

    const fileInputRef = useRef(null)

    const handleInfoTypeChange = (e) => {
        const infoType = e.target.value

        if (formik.values.infoType !== infoType) {
            formik.setValues({
                ...formik.values,
                infoType,
                selectedElements: null,
                selectedElementsInfo: null,
            })
            if (fileInputRef.current) 
                fileInputRef.current.value = ''
        }
    }

    return (
        <form
            className='form-container'
            onSubmit={formik.handleSubmit}
            >
            <h1 
                className='form-title'
                >
                Generar reporte
            </h1>
            
            <section 
                className='multi-layered-form'
                >
                <section 
                    className='manage-section'
                    >
                    <h2 
                        className='form-subtitle'
                        >
                        Datos del reporte
                    </h2>

                    <label 
                        className='form-label' 
                        htmlFor='info'
                        >
                        Información a reportar:
                    </label>

                    <SearchableSelect
                        id='info'
                        elements={AVAILABLE_INFO_MAPPING}
                        />
                    
                    <span
                        className='error'
                        style={formik.errors.infoType && formik.touched.infoType ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.infoType}
                    </span>

                    <label 
                        className='form-label' 
                        htmlFor='description'
                        >
                        Elementos a reportar:
                    </label>
                    

                
                    <span
                        className='error'
                        style={formik.errors.description && formik.touched.description ? {} : { visibility: 'hidden' }}
                        >
                        {formik.errors.description}
                    </span>
                </section>

                {formik.values.attachmentType &&
                    <section
                        className='manage-section'
                        >
                        <h2 
                            className='form-subtitle'
                            >
                            Reporte generado en pdf
                        </h2>

                        {(formik.values.url || formik.values.file) &&
                            <>
                                <label className='form-label'>
                                    Adjunto actual:
                                </label>
                                
                                {formik.values.attachmentType === 'url'?
                                    <a 
                                        className='form-label'
                                        href={formik.values.url} 
                                        target='_blank' 
                                        rel='noopener noreferrer'>
                                        {formik.values.url}
                                    </a>
                                    :
                                    <FilePreviewer 
                                        source={formik.values.file}
                                        />}
                            </>}
                    </section>}
            </section>

            <FormButtons modalId={modalId} closeModal={closeModal} isValid={formik.isValid}/>      
        </form>
    )
}

ReportForm.propTypes = {
    modalId: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    userRole: PropTypes.string.isRequired,
}

export default ReportForm