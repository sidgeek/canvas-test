import { Point2d } from "./point2d"

export const move = 'mousemove'
export const click = 'mousedown'

export class Canvas {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = 800
    this.canvas.height = 600
    this.allShapes = []

    this.canvas.addEventListener(move, this.handleEvent(move))
    this.canvas.addEventListener(click, this.handleEvent(click))
  }

  getNewEvent(event) {
    const point = new Point2d(event.offsetX, event.offsetY)
    return {
      point,
      isStopBubble: false,
      ...event,
    }
  }

  handleEvent = (name) => (event) => {
    event = this.getNewEvent(event)
    this.allShapes.forEach((shape) => {
      // 获取当前事件的所有监听者
      const listerns = shape.listenerMap.get(name)
      if (
        listerns &&
        shape.isPointInClosedRegion(event)
        && !event.isStopBubble
      ) {
        listerns.forEach((listener) => listener(event))
      }
    })
  }

  add(shape) {
    shape.draw(this.ctx)
    this.allShapes.push(shape)
  }
}

