import { iMatrix } from "./const"

export class Canvas {
  constructor() {
    this._canvas = document.getElementById('canvas')
    this.ctx = this._canvas.getContext('2d')
    this.width = 800
    this.height = 600

    this.viewportTransform = iMatrix.concat()
  }

  getCenter() {
    return {
      top: this.height / 2,
      left: this.width / 2
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

  setViewportTransform(vpt) {
    // var activeObject = this._activeObject,
    //     backgroundObject = this.backgroundImage,
    //     overlayObject = this.overlayImage,
    //     object, i, len;
    this.viewportTransform = vpt;
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
    // return this;
  }


  updateSize(w, h) {
    this.width = w
    this.height = h
  }
}

