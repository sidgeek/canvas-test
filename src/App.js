import { useCallback, useContext, useEffect } from 'react'
import './App.css';
import { Canvas } from './core/canvas';
// import { Mousedown } from './core/const';
import { Circle } from './core/shape/circle';
// import { Point2d } from './core/point2d';
// import { Polygon } from './core/polygon';
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

    // const points = []
    // for (let i = 0; i < 5; i++) {
    //   points.push(Point2d.random(800, 600))
    // }
    // const shape = new Polygon({
    //   x: points[0].x,
    //   y: points[0].y,
    //   points,
    //   fillColor: 'orange',
    // })

    // 添加到画布中
    // canvas.add(shape)

    // const handleCircleClick = (event) => {
    //   event.isStopBubble = true
    //   // console.log(event, 'circle')
    // }

    // const handleRectClick = (event) => {
    //   event.isStopBubble = true
    //   // console.log(event, 'rect')
    // }

    // const handlePolygonClick = (event) => {
    //   event.isStopBubble = true
    //   // console.log(event, 'polygon')
    // }

    // circle.on(Mousedown, handleCircleClick)
    // rect.on(Mousedown, handleRectClick)
    // shape.on(Mousedown, handlePolygonClick)

    return () => {
      // circle.off(Mousedown, handleCircleClick)
      // rect.off(Mousedown, handleRectClick)
      // shape.off(Mousedown, handlePolygonClick)
    }
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
