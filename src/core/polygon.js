import { Point2d } from "./point2d"
import { Seg2d } from "./seg2d"
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
    const allSegs = Seg2d.getSegments(this.getDispersed(), true)
    // 选取任意一条射线
    const start = event.point
    const xAxias = new Point2d(1, 0).multiplyScalar(800)
    const end = start.clone().add(xAxias)
    const anyRaySeg = new Seg2d(start, end)
    let total = 0
    allSegs.forEach((item) => {
      const intersetSegs = Seg2d.lineLineIntersect(item, anyRaySeg)
      total += intersetSegs.length
    })
    // 奇数在内部
    if (total % 2 === 1) {
      return true
    }
    return false
  }
}