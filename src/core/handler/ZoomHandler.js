import { Point2d } from "../point2d";
import { invertTransform, transformPoint } from "../utils/matrix";
import BaseHandler from "./BaseHandler";

class ZoomHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()
  }

  initialize() {

  }

  zoomIn() {
    let zoomRatio = this.canvas.getZoom()
    zoomRatio += 0.05
    const center = this.canvas.getCenter()
  }

  zoomOut() {
    let zoomRatio = this.canvas.getZoom()
    zoomRatio -= 0.05
  }

  zoomToOne() {
    const center = this.canvas.getCenter()
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    this.zoomToPoint(Point2d(center.left, center.top), 1)
  }

  zoomToRatio(zoomRatio) {
    const center = this.canvas.getCenter()
    this.zoomToPoint(Point2d(center.left, center.top), zoomRatio)
  }

  zoomToPoint(point, zoom) {
    const minZoom = 10
    const maxZoom = 300
    let zoomRatio = zoom
    if (zoom <= minZoom / 100) {
      zoomRatio = minZoom / 100
    } else if (zoom >= maxZoom / 100) {
      zoomRatio = maxZoom / 100
    }
    // this.canvas.zoomToPoint(point, zoomRatio)

    var before = point, vpt = this.canvas.viewportTransform.slice(0);
    point = transformPoint(point, invertTransform(this.canvas.viewportTransform));
    vpt[0] = zoomRatio;
    vpt[3] = zoomRatio;
    var after = transformPoint(point, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;
    this.canvas.setViewportTransform(vpt);
  }
}

export default ZoomHandler
