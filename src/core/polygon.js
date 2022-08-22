import { Shape } from "./shape"

export class Polygon extends Shape {
  constructor(props) {
    super()
    this.props = props
  }
  draw(ctx) {
    const { points, fillColor = 'black' } = this.props
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = fillColor
    points.forEach((point, index) => {
      const { x, y } = point
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  getDispersed() {
    return this.props.points
  }

  isPointInClosedRegion(event) {
  }
}