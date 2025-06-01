import useAuthorName from './useAuthorName'

/**
 * @description Hook asociado al componente para mostrar detalles de un acta de defensa.
 * @param {Object} `values`- Contiene toda la información del acta de defensa a mostrar.
 * @returns Valores necesarios para el componente a renderizar.
 */
const useReadOnlyDefenseActForm = (values) => {
    const authorName = useAuthorName(true, values)

    return authorName
}

export default useReadOnlyDefenseActForm