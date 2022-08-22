import { useEffect } from 'react';
import './App.css';
import { Canvas } from './core/canvas';
import { Circle } from './core/circle';
import { Point2d } from './core/point2d';
import { Rect } from './core/rect';


function App() {
  useEffect(() => {
    const canvas = new Canvas()
    const circle = new Circle({
      center: new Point2d(50, 50),
      radius: 50,
      fillColor: 'green',
    })
    const rect = new Rect({
      leftTop: new Point2d(50, 50),
      width: 100,
      height: 100,
      fillColor: 'black',
    })
    // 添加
    canvas.add(circle)
    canvas.add(rect)
  }, [])


  return (
    <div className="App">
      <canvas id='canvas'/>
    </div>
  );
}

export default App;
