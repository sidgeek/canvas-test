import { BaseObject } from "./baseObject"
export default class Polygon extends BaseObject {
  constructor(props) {
    super(props)
    const { fillColor = 'black', sides, radius } = props
    this.fillColor = fillColor
    this.sides = sides
    this.radius = radius
  }
  _render(ctx) {
    const points = this._getPoints();

    ctx.beginPath();
    // ctx.lineWidth = 1
    ctx.moveTo(points[0].x, points[0].y);

    for (var n = 1; n < points.length; n++) {
      ctx.lineTo(points[n].x, points[n].y);
    }

    ctx.closePath();
    ctx.stroke();
  }

  _getPoints() {
    const sides = this.sides;
    const radius = this.radius || 0;
    const points = [];
    for (var n = 0; n < sides; n++) {
      points.push({
        x: radius * Math.sin((n * 2 * Math.PI) / sides),
        y: -1 * radius * Math.cos((n * 2 * Math.PI) / sides),
      });
    }
    return points;
  }
}
