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
}
