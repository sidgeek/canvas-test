import { createContext, useCallback, useState } from 'react'
import useReference from './useReference'

export const EditorContext = createContext({
  canvas: null,
  setCanvas: () => {},
  activeObject: null,
  setActiveObject: () => {},
  handlers: null,
  setHandlers: () => {},
  zoomRatio: 1,
  setZoomRatio: () => {},
  isNormal: true,
  seIsNormal: () => {},
})

export const EditorProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null)
  const [activeObject, setActiveObject] = useState(null)
  const [handlers, setHandlers] = useState(null)
  const [zoomRatio, setZoomRatio] = useState(1)
  const [isNormal, _seIsNormal] = useState(true)
  const modeRef = useReference(isNormal)

  const seIsNormal = useCallback(
    () => {
      _seIsNormal(!modeRef.current)
    },
    [modeRef],
  )
  

  const context = {
    canvas,
    setCanvas,
    activeObject,
    setActiveObject,
    handlers,
    setHandlers,
    zoomRatio,
    setZoomRatio,
    isNormal,
    seIsNormal
  }

  return <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
}
