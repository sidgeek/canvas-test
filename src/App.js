import { useCallback, useContext, useEffect } from 'react'
import './App.css';
import { Canvas } from './core/canvas';
import { Circle } from './core/shape/circle';
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

  const addCircle = useCallback(() => {
    if (!context) return

    const circle = new Circle({
      canvas: context.canvas,
      x: 150,
      y: 150,
      radius: 50,
      fillColor: 'green',
    })

    // 添加
    context.handlers.add(circle)
  }, [context])



  const addRect = useCallback(() => {
    if (!context) return
    rect = new Rect({
      canvas: context.canvas,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fillColor: 'black',
    })
    context.handlers.add(rect)
  }, [context])

  const scaleRect = useCallback(() => {
    if (!context) return
    context.handlers.scale(rect, 1.1)
  }, [context])

  return (
    <div className="App">
      <canvas id='canvas' />
      <div>
        <button onClick={addRect}>add Rect </button>
        <button onClick={scaleRect}>scale Rect </button>
        <button onClick={addCircle}>add Circle </button>
      </div>
    </div>
  );
}

export default App;
