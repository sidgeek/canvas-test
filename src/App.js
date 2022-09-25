import { useCallback, useContext, useEffect } from 'react'
import './App.css';
import { Canvas } from './core/canvas';
import { Rect } from './core/shape/rect';
import Handlers from './core/handler'
import { EditorContext } from "./core/context"

let rect;

function App() {
  const context = useContext(EditorContext)

  useEffect(() => {
    const canvas = new Canvas()
    const handlers = new Handlers({ canvas })

    context.setHandlers(handlers)
    context.setCanvas(canvas)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const addRect = useCallback(() => {
    if (!context) return
    rect = new Rect({
      canvas: context.canvas,
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fillColor: 'black',
    })
    context.handlers.add(rect)
  }, [context])

  return (
    <div className="App">
      <canvas id='canvas' />
      <div>
        <button onClick={addRect}>add Rect </button>
      </div>
    </div>
  );
}

export default App;
