import { Shape } from "./shape"

export class Circle extends Shape {
  constructor(props) {
    super(props)
    this.props = props
    const { radius, fillColor = 'black' } = props
    this.radius = radius
    this.fillColor = fillColor
  }

  draw(ctx) {
    const { x, y, radius, fillColor } = this
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(mouse) {
    const { x, y, radius } = this.props
    return mouse.point.distance({x, y}) <= radius * radius
  }
}

