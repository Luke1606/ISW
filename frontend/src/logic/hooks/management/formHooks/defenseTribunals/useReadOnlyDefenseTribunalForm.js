import useFetchProfessors from './useFetchProfessors'

/**
 * @description Ventana para mostrar detalles de un acta de defensa.
 * @param {function} `closeFunc- Función para cerrar el componente.
 * @param {Object} `values`- Contiene toda la información del tribunal.
 * @returns Estructura de los campos a mostrar con la información del tribunal contenido en `values`.
 */
const useReadOnlyDefenseTribunalForm = (values) => {
    const professors = useFetchProfessors()
        
    const filteredProfessors = professors?.filter(professor => {
        return [
            values?.president,
            values?.secretary,
            values?.vocal,
            values?.opponent
        ].includes(professor.value) || values?.tutors.includes(professor.value)
    })

    return filteredProfessors
}

export default useReadOnlyDefenseTribunalForm