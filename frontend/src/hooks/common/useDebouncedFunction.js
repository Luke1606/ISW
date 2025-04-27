import { useCallback, useRef, useEffect } from "react"
import _ from "lodash"
/**
 * @description Utiliza {@link _.debounce} y {@link useCallback} para optimizar el funcionamiento de un {@link callback}.
 * @param {function(): any} callback - función anónima o funcion flecha a envolver en la función debounced a devolver.
 * @param {number} delay - tiempo deseado de retraso para la ejecución, mayormente utilizado para funciones asíncronas. Si no se proporciona, el valor por defecto será 0.
 * @default 0
 * @example
 * // Ejemplo: Debounce una función que obtiene datos del servidor con 500ms de retraso
 * const fetchData = useDebouncedFunction(() => {
 *    console.log("Fetching data...");
 *    // Aquí puedes añadir una llamada a un servicio, como una API.
 * }, 500);
 * 
 * fetchData("example-query");
 *
 * @returns Versión optimizada (debounced) del {@link callback}.
 */
const useDebouncedFunction = (callback, delay = 0) => {
  // Utilizamos useRef para persistir la referencia de la función debounced entre renders.
  const debouncedFunctionRef = useRef()

  useEffect(() => {
    debouncedFunctionRef.current = _.debounce(callback, delay)
    
    // Limpia todas las llamadas pendientes cuando un componente se desmonta o cambian las dependencias
    return () => {
      debouncedFunctionRef.current.cancel()
    }
  }, [callback, delay])

  return useCallback((...args) => debouncedFunctionRef.current(...args), [])
}

export default useDebouncedFunction