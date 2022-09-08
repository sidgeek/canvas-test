import { Shape } from "./shape"

export class Rect extends Shape {
  constructor(props) {
    super(props)
    const { width, height, fillColor = 'black' } = props
    this.width = width
    this.height = height
    this.fillColor = fillColor
  }
  render() {
    const ctx = this.ctx
    const { x, y, width, height, fillColor } = this
    ctx.save()
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)
    ctx.restore()
    super.render();
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(point) {
    const controlId = super.isPointInControlPoint(point)

    if (controlId) {
      return { isIn: true, controlId}
    }


    const { x, y, width, height } = this
    const maxX = x + width
    const maxY = y + height
    if (point.x >= x && point.x <= maxX && point.y >= y && point.y <= maxY) {
      return { isIn: true, controlId }
    }
    return { isIn: false, controlId }
  }
}
