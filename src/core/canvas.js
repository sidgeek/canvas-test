
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

  handleEvent = (name) => (event) => {
    this.allShapes.forEach((shape) => {
      // 获取当前事件的所有监听者
      const listerns = shape.listenerMap.get(name)
      if (listerns) {
        listerns.forEach((listener) => listener(event))
      }
    })
  }

  add(shape) {
    shape.draw(this.ctx)
    this.allShapes.push(shape)
  }
}

