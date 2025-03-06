import { useCallback } from "react"
import _ from "lodash"

const useDebouncedApiCall = (apiFunction, delay) => useCallback(_.debounce(apiFunction, delay), [apiFunction])

export default useDebouncedApiCall