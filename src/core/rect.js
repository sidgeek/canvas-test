import { Shape } from "./shape"

export class Rect extends Shape {
  constructor(props) {
    super(props)
    const { width, height, fillColor = 'black' } = props
    this.props = props
    this.width = width
    this.height = height
    this.fillColor = fillColor
  }
  draw(ctx) {
    const { x, y, width, height, fillColor } = this
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)
    ctx.closePath()
    ctx.restore()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(mouse) {
    const { x, y } = mouse.point
    const { x: minX, y: minY, width, height } = this.props
    const maxX = minX + width
    const maxY = minY + height
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true
    }
    return false
  }
}
