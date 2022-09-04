import { Point2d } from "./point2d"
import { Seg2d } from "./seg2d"
import { Shape } from "./shape"

export class Polygon extends Shape {
  constructor(props) {
    super(props)
    const { points, fillColor = 'black' } = props
    this.points = points
    this.fillColor = fillColor
  }
  draw(ctx) {
    const { fillColor, points } = this

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
    return this.points
  }

  isPointInClosedRegion(point) {
    const allSegs = Seg2d.getSegments(this.getDispersed(), true)
    // 选取任意一条射线
    const start = point
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