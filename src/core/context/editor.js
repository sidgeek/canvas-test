import { createContext, useState } from 'react'

export const EditorContext = createContext({
  canvas: null,
  setCanvas: () => {},
  activeObject: null,
  setActiveObject: () => {},
  handlers: null,
  setHandlers: () => {},
  zoomRatio: 1,
  setZoomRatio: () => {},
})

export const EditorProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null)
  const [activeObject, setActiveObject] = useState(null)
  const [handlers, setHandlers] = useState(null)
  const [zoomRatio, setZoomRatio] = useState(1)

  const context = {
    canvas,
    setCanvas,
    activeObject,
    setActiveObject,
    handlers,
    setHandlers,
    zoomRatio,
    setZoomRatio,
  }

  return <EditorContext.Provider value={context}>{children}</EditorContext.Provider>
}
