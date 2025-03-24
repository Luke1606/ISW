import { useCallback } from "react"
import _ from "lodash"

const useDebouncedApiCall = (apiFunction, delay=0) => 
    useCallback(_.debounce(apiFunction, delay), [apiFunction])

export default useDebouncedApiCall