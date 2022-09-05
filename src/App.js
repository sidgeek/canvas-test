import { useCallback, useContext, useEffect } from 'react'
import './App.css';
import { Canvas } from './core/canvas';
// import { click } from './core/const';
import { Circle } from './core/circle';
// import { Point2d } from './core/point2d';
// import { Polygon } from './core/polygon';
import { Rect } from './core/rect';
import Handlers from './core/handler'
import { EditorContext } from "./core/context"

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

    // circle.on(click, handleCircleClick)
    // rect.on(click, handleRectClick)
    // shape.on(click, handlePolygonClick)

    return () => {
      // circle.off(click, handleCircleClick)
      // rect.off(click, handleRectClick)
      // shape.off(click, handlePolygonClick)
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
    const rect = new Rect({
      canvas: context.canvas,
      x: 0,
      y: 0,
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
        <button onClick={addCircle}>add Circle </button>
      </div>
    </div>
  );
}

export default App;
