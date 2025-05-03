import { spanishTranslationMap } from '@/data'

const useTranslateToSpanish = () => {
    return (key) => {
        if (spanishTranslationMap[key]) {
            return spanishTranslationMap[key]
        }
        console.warn(`El valor en inglés ${key} no se reconoce`)
    }
}

export default useTranslateToSpanish