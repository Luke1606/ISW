import { useCallback, useRef, useEffect } from "react"
import _ from "lodash"

const useDebouncedApiCall = (apiFunction, delay = 0) => {
  const debouncedFunctionRef = useRef()

  useEffect(() => {
    debouncedFunctionRef.current = _.debounce(apiFunction, delay)
    
    // Limpia todas las llamadas pendientes cuando un componente se desmonta o cambian las dependencias
    return () => {
      debouncedFunctionRef.current.cancel()
    }
  }, [apiFunction, delay])

  return useCallback((...args) => debouncedFunctionRef.current(...args), [])
}

export default useDebouncedApiCall