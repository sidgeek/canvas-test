import { Shape } from "./shape"

export class Rect extends Shape {
  constructor(props) {
    super()
    this.props = props
  }
  draw(ctx) {
    const { leftTop, width, height, fillColor = 'black' } = this.props
    const { x, y } = leftTop
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
    const { leftTop, width, height } = this.props
    const { x: minX, y: minY } = leftTop
    const maxX = minX + width
    const maxY = minY + height
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true
    }
    return false
  }
}
