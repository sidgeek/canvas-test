import { iMatrix } from "./const"
import { Point } from "./point"

export class Canvas {
  constructor() {
    this._canvas = document.getElementById('canvas')
    this.ctx = this._canvas.getContext('2d')
    this.width = 800
    this.height = 600

    this.viewportTransform = iMatrix.concat()
  }


  getWidth() {
    return this.width / 2
  }

  getHeight() {
    return this.height / 2
  }

  getCenter() {
    return {
      x: this.height / 2,
      y: this.width / 2
    };
  }

  getCenterPoint() {
    return new Point(this.height / 2, this.width / 2)
  }

  getZoom() {
    return this.viewportTransform[0];
  }

  getViewportTransform () {
    return this.viewportTransform;
  }

  setViewportTransform(v) {
    this.viewportTransform = v;
    this.ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    return this;
  }


  absolutePan (point) {
    var vpt = this.viewportTransform.slice(0);
    vpt[4] = -point.x;
    vpt[5] = -point.y;
    return this.setViewportTransform(vpt);
  }

  /**
   * Pans viewpoint relatively
   * @param {Point} point (position vector) to move by
   * @return {Canvas} instance
   * @chainable true
   */
  relativePan (point) {
    return this.absolutePan(new Point(
      -point.x - this.viewportTransform[4],
      -point.y - this.viewportTransform[5]
    ));
  }

  updateSize(w, h) {
    this.width = w
    this.height = h
  }
}

