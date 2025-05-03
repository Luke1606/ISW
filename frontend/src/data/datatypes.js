/**
 * @description Contiene todos los tipos de datos a manejar en la aplicación para un manejo centralizado.
 */
const datatypes = {
    user: {
        student: 'student',
        professor: 'professor',
        dptoInf: 'dptoInf',
        decan: 'decan'
    },
    evidence: 'evidence',
    request: 'request',
    defense_tribunal: 'defense_tribunal',
    tribunal: 'tribunal',
    defense_act: 'defense_act',
    report: 'report',
    default: 'none'
}

/**
 * @description Contiene la version en español de todos los tipos de datos a manejar en la aplicación para un manejo centralizado.
 */
const spanishTranslationMap = {
    student: 'Estudiante',
    professor: 'Profesor',
    dptoInf: 'Miembro del Departamento de Informática',
    decan: 'Decano',
    evidence: 'Evidencia',
    request: 'Solicitud',
    defense_tribunal: 'Defensa y Tribunal',
    tribunal: 'Tribunal',
    defense_act: 'Acta de defensa',
    report: 'Reporte',
    default: 'Ninguno'
}

export { datatypes, spanishTranslationMap }