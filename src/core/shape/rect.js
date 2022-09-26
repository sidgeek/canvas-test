import { SHAPE_POS } from "../types/const"
import { Shape } from "./shape"

export class Rect extends Shape {
  constructor(props) {
    super(props)
    const { fillColor = 'black' } = props
    this.fillColor = fillColor
  }
  _render(ctx) {
    const { width: w, height: h, fillColor } = this
    const x = - w / 2
    const y = - h / 2

    ctx.beginPath();
    ctx.fillStyle = fillColor
    ctx.fillRect(x, y, w, h)
    // ctx.moveTo(x, y);
    // ctx.lineTo(x + w, y);
    // ctx.lineTo(x + w, y + h);
    // ctx.lineTo(x, y + h);
    // ctx.lineTo(x, y);
    // ctx.closePath();
    // ctx.fill();
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
