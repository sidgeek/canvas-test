import { BaseObject } from "./baseObject"
export default class Star extends BaseObject {
  constructor(props) {
    super(props)
    const { fillColor = 'black', innerRadius, outerRadius, numPoints } = props
    this.fillColor = fillColor
    this.innerRadius = innerRadius
    this.outerRadius = outerRadius
    this.numPoints = numPoints
  }
  _render(ctx) {
    const { outerRadius: o, innerRadius: inner, numPoints: num } = this
    ctx.beginPath();
    ctx.moveTo(0, 0 - o);

    for (let n = 1; n < num * 2; n++) {
      var radius = n % 2 === 0 ? o : inner
      var x = radius * Math.sin((n * Math.PI) / num);
      var y = -1 * radius * Math.cos((n * Math.PI) / num);
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }
}
