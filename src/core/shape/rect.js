import { SHAPE_POS } from "../types/const"
import { Shape } from "./shape"

export class Rect extends Shape {
  constructor(props) {
    super(props)
    const { fillColor = 'black' } = props
    this.fillColor = fillColor
  }
  _render(ctx) {
    const { width, height, fillColor } = this
    const x = - 2 / width
    const y = - 2 / height

    ctx.beginPath();
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, width, height)
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(point) {
    const { shapePos } = super.isPointInControlPoint(point)

    if (shapePos !== SHAPE_POS.Null) {
      return { isIn: true, shapePos }
    }

    const { x, y, width: w, height: h } = this
    const width = w * this.scaleX
    const height = h * this.scaleY
    const maxX = x + width
    const maxY = y + height
    if (point.x >= x && point.x <= maxX && point.y >= y && point.y <= maxY) {
      return { isIn: true, shapePos: SHAPE_POS.Body }
    }
    return { isIn: false, shapePos }
  }
}
