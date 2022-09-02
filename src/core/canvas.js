import { iMatrix } from "./const"
import { Point } from "./point"
import { invertTransform, transformPoint } from "./utils/matrix"

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

  zoomToPoint(point, value) {
    // TODO: just change the scale, preserve other transformations
    var before = point, vpt = this.viewportTransform.slice(0);
    point = transformPoint(point, invertTransform(this.viewportTransform));
    vpt[0] = value;
    vpt[3] = value;
    var after = transformPoint(point, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;
    return this.setViewportTransform(vpt);
  }

  getZoom() {
    return this.viewportTransform[0];
  }

  getViewportTransform () {
    return this.viewportTransform;
  }

  setViewportTransform(v) {
    // var activeObject = this._activeObject,
    //     backgroundObject = this.backgroundImage,
    //     overlayObject = this.overlayImage,
    //     object, i, len;
    this.viewportTransform = v;

    // ctx.save();
    this.ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);

    // console.log('>>> tr before', this.ctx.getTransform());
    // this.ctx.scale(0.2, 0.2)
    // console.log('>>> tr after', this.ctx.getTransform());

    // for (i = 0, len = this._objects.length; i < len; i++) {
    //   object = this._objects[i];
    //   object.group || object.setCoords(true);
    // }
    // if (activeObject) {
    //   activeObject.setCoords();
    // }
    // if (backgroundObject) {
    //   backgroundObject.setCoords(true);
    // }
    // if (overlayObject) {
    //   overlayObject.setCoords(true);
    // }
    // this.calcViewportBoundaries();
    // this.renderOnAddRemove && this.requestRenderAll();
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

