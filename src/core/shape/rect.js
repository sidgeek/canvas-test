import { SHAPE_POS } from "../types/const"
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
    super.scaleByPoint()
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)
    ctx.restore()
    super.render();
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(point) {
    const { shapePos } = super.isPointInControlPoint(point)

    if (shapePos !== SHAPE_POS.Null) {
      return { isIn: true, shapePos }
    }

    const { x, y, width, height } = this
    const maxX = x + width
    const maxY = y + height
    if (point.x >= x && point.x <= maxX && point.y >= y && point.y <= maxY) {
      return { isIn: true, shapePos: SHAPE_POS.Body }
    }
    return { isIn: false, shapePos }
  }
}
