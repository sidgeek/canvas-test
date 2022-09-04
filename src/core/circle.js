import { Shape } from "./shape"

export class Circle extends Shape {
  constructor(props) {
    super(props)
    const { radius, fillColor = 'black' } = props
    this.radius = radius
    this.fillColor = fillColor
  }

  draw(ctx) {
    // const tr = ctx.getTransform()
    // console.log('>>> tr', tr);
    const { x, y, radius, fillColor } = this
    // ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
    // ctx.restore()
  }

  // 判断鼠标的点是否在图形内部
  isPointInClosedRegion(point) {
    debugger
    const { x, y, radius } = this
    return point.distance({x, y}) <= radius * radius
  }
}

