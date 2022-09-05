import { Shape } from "./shape"

export class Rect extends Shape {
  constructor(props) {
    super(props)
    const { width, height, fillColor = 'black' } = props
    this.width = width
    this.height = height
    this.fillColor = fillColor
  }
  draw(ctx) {
    const { x, y, width, height, fillColor } = this
    console.log('>>>', x, y)
    debugger
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)
    ctx.closePath()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(point) {
    const { x, y, width, height } = this
    const maxX = x + width
    const maxY = y + height
    if (point.x >= x && point.x <= maxX && point.y >= y && point.y <= maxY) {
      return true
    }
    return false
  }
}
