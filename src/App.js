import { useCallback, useContext, useEffect } from 'react'
import './App.css';
import { Canvas } from './core/canvas';
import { Rect, Star, Polygon } from './core/shapes';
import Handlers from './core/handler'
import { EditorContext } from "./core/context"

let rect;

function App() {
  const context = useContext(EditorContext)
  const { isNormal } = context

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

  const addStar = useCallback(() => {
    if (!context) return
    rect = new Star({
      canvas: context.canvas,
      left: 300,
      top: 300,
      innerRadius: 70,
      outerRadius: 100,
      numPoints: 5,
      fillColor: 'black',
    })
    context.handlers.add(rect)
  }, [context])

  const addPolygon = useCallback(() => {
    if (!context) return
    const polygon = new Polygon({
      canvas: context.canvas,
      left: 100,
      top: 100,
      sides: 5,
      radius: 100,
      fillColor: 'black',
    })

    console.log('>>> rect:', polygon.getSelfRect());
    
    context.handlers.add(polygon)
  }, [context])

  const switchModeRect = useCallback(() => {
    if (!context) return
    context.seIsNormal()
  }, [context])

  const clear = useCallback(() => {
    if (!context) return
    context.handlers.canvasHandler.clean()
  }, [context])

  return (
    <div className="App">
      <canvas id='canvas' />
      <div>
        <button onClick={addRect}>add Rect </button>
        <button onClick={addStar}>add Star </button>
        <button onClick={addPolygon}>add Polygon </button>
        <button onClick={switchModeRect}>Mode update</button>
        <button onClick={clear}>clear</button>
        <div>Mode: {isNormal ? 'Normal' : 'Draw'} </div>
      </div>
    </div>
  );
}

export default App;
