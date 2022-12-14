import { SHAPE_POS } from "../types/const"
import { Shape } from "./shape"

export class Circle extends Shape {
  constructor(props) {
    super(props)
    const { radius, fillColor = 'black' } = props
    this.radius = radius
    this.fillColor = fillColor
  }

  render() {
    const ctx = this.ctx
    const { x, y, radius, fillColor } = this
    ctx.save()
    super.scaleByPoint()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(point) {
    const { shapePos } = super.isPointInControlPoint(point)

    if (shapePos !== SHAPE_POS.Null) {
      return { isIn: true, shapePos }
    }

    const { x, y, radius } = this
    const isIn = point.distance({ x, y }) <= radius * radius
    return { isIn, shapePos: isIn ? SHAPE_POS.Body : SHAPE_POS.Null}
  }
}

