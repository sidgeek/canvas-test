import { useEffect, useRef } from 'react'

const useReference = (data) => {
  const container = useRef(data)
  useEffect(() => {
    container.current = data
  }, [data])
  return container
}

export default useReference
