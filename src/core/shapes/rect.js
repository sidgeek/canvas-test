import { BaseObject } from "./baseObject"
export default class Rect extends BaseObject {
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
  }
}
