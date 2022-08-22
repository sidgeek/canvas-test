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
  }
}
