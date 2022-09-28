import { Point } from "../point"
import { Util } from "../helpers/Util"

// 图形的基类
export class BaseObject {
  constructor(props) {
    const { canvas, left, top, width, height } = props
    this._id = BaseObject.getId()
    this.ctx = canvas.ctx
    this.left = left
    this.top = top
    this.scaleX = 1
    this.scaleY = 1
    this.flipX = false
    this.flipY = false
    this.originX = 'center'
    this.originY = 'center'
    this.width = width
    this.height = height
    this.angle = 0

    // 控制点
    /** 是否有控制点 */
    this.hasControls = true;
    this.oCoords = []
    this.cornerSize = 10

    /** 是否处于激活态，也就是是否被选中 */
    this.active = false;
    this.isHovering = false
    this.listenerMap = new Map()

    this.padding = 0
    this.strokeWidth = 0
  }

  static id = 0
  static BorderPadding = 0
  static BorderWidth = 4
  static BorderColor = 'blue'

  static ControlPadding = 4
  static ControlColor = 'red'

  static getId() {
    return BaseObject.id++
  }

  /** 获取物体中心点 */
  getCenterPoint() {
    return this.translateToCenterPoint(new Point(this.left, this.top), this.originX, this.originY);
  }

  /** 将中心点移到变换基点 */
  translateToCenterPoint(point, originX, originY) {
    let cx = point.x,
      cy = point.y;

    if (originX === 'left') {
      cx = point.x + this.getWidth() / 2;
    } else if (originX === 'right') {
      cx = point.x - this.getWidth() / 2;
    }

    if (originY === 'top') {
      cy = point.y + this.getHeight() / 2;
    } else if (originY === 'bottom') {
      cy = point.y - this.getHeight() / 2;
    }
    const p = new Point(cx, cy);
    if (this.angle) {
      return Util.rotatePoint(p, point, Util.degreesToRadians(this.angle));
    } else {
      return p;
    }
  }

  /** 绘制前需要进行各种变换（包括平移、旋转、缩放）
   * 注意变换顺序很重要，顺序不一样会导致不一样的结果，所以一个框架一旦定下来了，后面大概率是不能更改的
   * 我们采用的顺序是：平移 -> 旋转 -> 缩放，这样可以减少些计算量，如果我们先旋转，点的坐标值一般就不是整数，那么后面的变换基于非整数来计算
   */
  transform(ctx) {
    let center = this.getCenterPoint();
    ctx.translate(center.x, center.y);
    ctx.rotate(Util.degreesToRadians(this.angle));
    ctx.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1));
  }

  render(ctx, noTransform) {
    ctx.save()

    if (!noTransform) {
      this.transform(ctx);
    }

    // 绘制物体
    this._render(ctx)

    if (this.isHovering && this.active) {
      this.drawBoard(ctx)
      this.drawControls(ctx)
    } else if (this.active) {
      this.drawControls(ctx)
    } else if (this.isHovering) {
      this.drawBoard(ctx)
    }
    this.drawControls(ctx)
    ctx.restore();
  }

  drawBoard(ctx) {
    const { x, y, width, height } = this
    ctx.save()
    this.scaleByPoint()
    ctx.strokeStyle = BaseObject.BorderColor
    ctx.lineWidth = BaseObject.BorderWidth
    const b = BaseObject.BorderPadding
    const b_2 = b * 2
    ctx.strokeRect(x - b, y - b, width + b_2, height + b_2)
    ctx.restore()
  }

  drawControls(ctx) {
    if (!this.hasControls || !this.active) return;
    var size = this.cornerSize,
        size2 = size / 2,
        strokeWidth2 = this.strokeWidth / 2,
        left = -(this.width / 2),
        top = -(this.height / 2),
        _left,
        _top,
        sizeX = size / this.scaleX,
        sizeY = size / this.scaleY,
        paddingX = this.padding / this.scaleX,
        paddingY = this.padding / this.scaleY,
        scaleOffsetY = size2 / this.scaleY,
        scaleOffsetX = size2 / this.scaleX,
        scaleOffsetSizeX = (size2 - size) / this.scaleX,
        scaleOffsetSizeY = (size2 - size) / this.scaleY,
        height = this.height,
        width = this.width,
        methodName = this.transparentCorners ? 'strokeRect' : 'fillRect';

    ctx.save();

    ctx.lineWidth = 1 / Math.max(this.scaleX, this.scaleY);

    ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    ctx.strokeStyle = ctx.fillStyle = this.cornerColor;

    // top-left
    _left = left - scaleOffsetX - strokeWidth2 - paddingX;
    _top = top - scaleOffsetY - strokeWidth2 - paddingY;
    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // top-right
    _left = left + width - scaleOffsetX + strokeWidth2 + paddingX;
    _top = top - scaleOffsetY - strokeWidth2 - paddingY;

    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // bottom-left
    _left = left - scaleOffsetX - strokeWidth2 - paddingX;
    _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;

    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    // bottom-right
    _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
    _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;

    ctx.clearRect(_left, _top, sizeX, sizeY);
    ctx[methodName](_left, _top, sizeX, sizeY);

    if (!this.lockUniScaling) {
        // middle-top
        _left = left + width / 2 - scaleOffsetX;
        _top = top - scaleOffsetY - strokeWidth2 - paddingY;

        ctx.clearRect(_left, _top, sizeX, sizeY);
        ctx[methodName](_left, _top, sizeX, sizeY);

        // middle-bottom
        _left = left + width / 2 - scaleOffsetX;
        _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;

        ctx.clearRect(_left, _top, sizeX, sizeY);
        ctx[methodName](_left, _top, sizeX, sizeY);

        // middle-right
        _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
        _top = top + height / 2 - scaleOffsetY;

        ctx.clearRect(_left, _top, sizeX, sizeY);
        ctx[methodName](_left, _top, sizeX, sizeY);

        // middle-left
        _left = left - scaleOffsetX - strokeWidth2 - paddingX;
        _top = top + height / 2 - scaleOffsetY;

        ctx.clearRect(_left, _top, sizeX, sizeY);
        ctx[methodName](_left, _top, sizeX, sizeY);
    }

    // middle-top-rotate
    if (this.hasRotatingPoint) {
        _left = left + width / 2 - scaleOffsetX;
        _top = this.flipY ? top + height + this.rotatingPointOffset / this.scaleY - sizeY / 2 + strokeWidth2 + paddingY : top - this.rotatingPointOffset / this.scaleY - sizeY / 2 - strokeWidth2 - paddingY;

        ctx.clearRect(_left, _top, sizeX, sizeY);
        ctx[methodName](_left, _top, sizeX, sizeY);
    }

    ctx.restore();

    return this;
  }

  /** 获取当前大小，包含缩放效果 */
  getWidth() {
    return this.width * this.scaleX;
  }
  /** 获取当前大小，包含缩放效果 */
  getHeight() {
    return this.height * this.scaleY;
  }

  getStartPoint() {
    return {
      x: this.x,
      y: this.y
    }
  }

  on(eventName, listener) {
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName).push(listener)
    } else {
      this.listenerMap.set(eventName, [listener])
    }
  }

  off(eventName, listener) {
    if (this.listenerMap.has(eventName)) {
      const events = this.listenerMap.get(eventName)
      const id = events.indexOf(listener)
      if (id > -1) {
        events.splice(id, 1)
      }
    }
  }

  addRoot(root) {
    this.root = root
  }

  /** 重新设置物体包围盒的边框和各个控制点，包括位置和大小 */
  setCoords() {
    let strokeWidth = this.strokeWidth > 1 ? this.strokeWidth : 0,
      padding = this.padding,
      radian = Util.degreesToRadians(this.angle);

    this.currentWidth = (this.width + strokeWidth) * this.scaleX + padding * 2;
    this.currentHeight = (this.height + strokeWidth) * this.scaleY + padding * 2;

    // 物体中心点到顶点的斜边长度
    let _hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2));
    let _angle = Math.atan(this.currentHeight / this.currentWidth);
    // let _angle = Math.atan2(this.currentHeight, this.currentWidth);

    // offset added for rotate and scale actions
    let offsetX = Math.cos(_angle + radian) * _hypotenuse,
      offsetY = Math.sin(_angle + radian) * _hypotenuse,
      sinTh = Math.sin(radian),
      cosTh = Math.cos(radian);

    let coords = this.getCenterPoint();
    let tl = {
      x: coords.x - offsetX,
      y: coords.y - offsetY,
    };
    let tr = {
      x: tl.x + this.currentWidth * cosTh,
      y: tl.y + this.currentWidth * sinTh,
    };
    let br = {
      x: tr.x - this.currentHeight * sinTh,
      y: tr.y + this.currentHeight * cosTh,
    };
    let bl = {
      x: tl.x - this.currentHeight * sinTh,
      y: tl.y + this.currentHeight * cosTh,
    };
    let ml = {
      x: tl.x - (this.currentHeight / 2) * sinTh,
      y: tl.y + (this.currentHeight / 2) * cosTh,
    };
    let mt = {
      x: tl.x + (this.currentWidth / 2) * cosTh,
      y: tl.y + (this.currentWidth / 2) * sinTh,
    };
    let mr = {
      x: tr.x - (this.currentHeight / 2) * sinTh,
      y: tr.y + (this.currentHeight / 2) * cosTh,
    };
    let mb = {
      x: bl.x + (this.currentWidth / 2) * cosTh,
      y: bl.y + (this.currentWidth / 2) * sinTh,
    };
    let mtr = {
      x: tl.x + (this.currentWidth / 2) * cosTh,
      y: tl.y + (this.currentWidth / 2) * sinTh,
    };

    // clockwise
    this.oCoords = { tl, tr, br, bl, ml, mt, mr, mb, mtr };

    // set coordinates of the draggable boxes in the corners used to scale/rotate the image
    this._setCornerCoords();

    return this;
  }
  /** 重新设置物体的每个控制点，包括位置和大小 */
  _setCornerCoords() {
    let coords = this.oCoords,
      radian = Util.degreesToRadians(this.angle),
      newTheta = Util.degreesToRadians(45 - this.angle),
      cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornerSize, 2)) / 2,
      cosHalfOffset = cornerHypotenuse * Math.cos(newTheta),
      sinHalfOffset = cornerHypotenuse * Math.sin(newTheta),
      sinTh = Math.sin(radian),
      cosTh = Math.cos(radian);

    coords.tl.corner = {
      tl: {
        x: coords.tl.x - sinHalfOffset,
        y: coords.tl.y - cosHalfOffset,
      },
      tr: {
        x: coords.tl.x + cosHalfOffset,
        y: coords.tl.y - sinHalfOffset,
      },
      bl: {
        x: coords.tl.x - cosHalfOffset,
        y: coords.tl.y + sinHalfOffset,
      },
      br: {
        x: coords.tl.x + sinHalfOffset,
        y: coords.tl.y + cosHalfOffset,
      },
    };

    coords.tr.corner = {
      tl: {
        x: coords.tr.x - sinHalfOffset,
        y: coords.tr.y - cosHalfOffset,
      },
      tr: {
        x: coords.tr.x + cosHalfOffset,
        y: coords.tr.y - sinHalfOffset,
      },
      br: {
        x: coords.tr.x + sinHalfOffset,
        y: coords.tr.y + cosHalfOffset,
      },
      bl: {
        x: coords.tr.x - cosHalfOffset,
        y: coords.tr.y + sinHalfOffset,
      },
    };

    coords.bl.corner = {
      tl: {
        x: coords.bl.x - sinHalfOffset,
        y: coords.bl.y - cosHalfOffset,
      },
      bl: {
        x: coords.bl.x - cosHalfOffset,
        y: coords.bl.y + sinHalfOffset,
      },
      br: {
        x: coords.bl.x + sinHalfOffset,
        y: coords.bl.y + cosHalfOffset,
      },
      tr: {
        x: coords.bl.x + cosHalfOffset,
        y: coords.bl.y - sinHalfOffset,
      },
    };

    coords.br.corner = {
      tr: {
        x: coords.br.x + cosHalfOffset,
        y: coords.br.y - sinHalfOffset,
      },
      bl: {
        x: coords.br.x - cosHalfOffset,
        y: coords.br.y + sinHalfOffset,
      },
      br: {
        x: coords.br.x + sinHalfOffset,
        y: coords.br.y + cosHalfOffset,
      },
      tl: {
        x: coords.br.x - sinHalfOffset,
        y: coords.br.y - cosHalfOffset,
      },
    };

    coords.ml.corner = {
      tl: {
        x: coords.ml.x - sinHalfOffset,
        y: coords.ml.y - cosHalfOffset,
      },
      tr: {
        x: coords.ml.x + cosHalfOffset,
        y: coords.ml.y - sinHalfOffset,
      },
      bl: {
        x: coords.ml.x - cosHalfOffset,
        y: coords.ml.y + sinHalfOffset,
      },
      br: {
        x: coords.ml.x + sinHalfOffset,
        y: coords.ml.y + cosHalfOffset,
      },
    };

    coords.mt.corner = {
      tl: {
        x: coords.mt.x - sinHalfOffset,
        y: coords.mt.y - cosHalfOffset,
      },
      tr: {
        x: coords.mt.x + cosHalfOffset,
        y: coords.mt.y - sinHalfOffset,
      },
      bl: {
        x: coords.mt.x - cosHalfOffset,
        y: coords.mt.y + sinHalfOffset,
      },
      br: {
        x: coords.mt.x + sinHalfOffset,
        y: coords.mt.y + cosHalfOffset,
      },
    };

    coords.mr.corner = {
      tl: {
        x: coords.mr.x - sinHalfOffset,
        y: coords.mr.y - cosHalfOffset,
      },
      tr: {
        x: coords.mr.x + cosHalfOffset,
        y: coords.mr.y - sinHalfOffset,
      },
      bl: {
        x: coords.mr.x - cosHalfOffset,
        y: coords.mr.y + sinHalfOffset,
      },
      br: {
        x: coords.mr.x + sinHalfOffset,
        y: coords.mr.y + cosHalfOffset,
      },
    };

    coords.mb.corner = {
      tl: {
        x: coords.mb.x - sinHalfOffset,
        y: coords.mb.y - cosHalfOffset,
      },
      tr: {
        x: coords.mb.x + cosHalfOffset,
        y: coords.mb.y - sinHalfOffset,
      },
      bl: {
        x: coords.mb.x - cosHalfOffset,
        y: coords.mb.y + sinHalfOffset,
      },
      br: {
        x: coords.mb.x + sinHalfOffset,
        y: coords.mb.y + cosHalfOffset,
      },
    };

    coords.mtr.corner = {
      tl: {
        x: coords.mtr.x - sinHalfOffset + sinTh * this.rotatingPointOffset,
        y: coords.mtr.y - cosHalfOffset - cosTh * this.rotatingPointOffset,
      },
      tr: {
        x: coords.mtr.x + cosHalfOffset + sinTh * this.rotatingPointOffset,
        y: coords.mtr.y - sinHalfOffset - cosTh * this.rotatingPointOffset,
      },
      bl: {
        x: coords.mtr.x - cosHalfOffset + sinTh * this.rotatingPointOffset,
        y: coords.mtr.y + sinHalfOffset - cosTh * this.rotatingPointOffset,
      },
      br: {
        x: coords.mtr.x + sinHalfOffset + sinTh * this.rotatingPointOffset,
        y: coords.mtr.y + cosHalfOffset - cosTh * this.rotatingPointOffset,
      },
    };
  }

  setActive(active = false) {
    this.active = !!active;
    return this;
  }

  setPositionByOrigin(pos, originX, originY) {
    let center = this.translateToCenterPoint(pos, originX, originY);
    let position = this.translateToOriginPoint(center, this.originX, this.originY);
    // console.log(`更新缩放的物体位置:[${position.x}，${position.y}]`);
    this.set('left', position.x);
    this.set('top', position.y);
  }

  /**
   * 平移坐标系到中心点
   * @param center
   * @param {string} originX  left | center | right
   * @param {string} originY  top | center | bottom
   * @returns
   */
  translateToOriginPoint(center, originX, originY) {
    let x = center.x,
        y = center.y;

    // Get the point coordinates
    if (originX === 'left') {
        x = center.x - this.getWidth() / 2;
    } else if (originX === 'right') {
        x = center.x + this.getWidth() / 2;
    }
    if (originY === 'top') {
        y = center.y - this.getHeight() / 2;
    } else if (originY === 'bottom') {
        y = center.y + this.getHeight() / 2;
    }

    // Apply the rotation to the point (it's already scaled properly)
    return Util.rotatePoint(new Point(x, y), center, Util.degreesToRadians(this.angle));
  }
  /** 转换成本地坐标 */
  toLocalPoint(point, originX, originY) {
      let center = this.getCenterPoint();

      let x, y;
      if (originX !== undefined && originY !== undefined) {
          if (originX === 'left') {
              x = center.x - this.getWidth() / 2;
          } else if (originX === 'right') {
              x = center.x + this.getWidth() / 2;
          } else {
              x = center.x;
          }

          if (originY === 'top') {
              y = center.y - this.getHeight() / 2;
          } else if (originY === 'bottom') {
              y = center.y + this.getHeight() / 2;
          } else {
              y = center.y;
          }
      } else {
          x = this.left;
          y = this.top;
      }

      return Util.rotatePoint(new Point(point.x, point.y), center, -Util.degreesToRadians(this.angle)).sub(new Point(x, y));
  }

  /** 检测哪个控制点被点击了 */
  _findTargetCorner(e, offset) {
    if (!this.hasControls || !this.active) return false;

    let pointer = Util.getPointer(e, this.root.canvasHandler.getCanvasEle()),
      ex = pointer.x - offset.left,
      ey = pointer.y - offset.top,
      xpoints,
      lines;

    for (let i in this.oCoords) {
      if (i === 'mtr' && !this.hasRotatingPoint) {
        continue;
      }

      lines = this._getImageLines(this.oCoords[i].corner);
      xpoints = this._findCrossPoints(ex, ey, lines);
      if (xpoints % 2 === 1 && xpoints !== 0) {
        return i;
      }
    }
    return false;
  }

  /** 获取包围盒的四条边 */
  _getImageLines(corner) {
    return {
      topline: {
        o: corner.tl,
        d: corner.tr,
      },
      rightline: {
        o: corner.tr,
        d: corner.br,
      },
      bottomline: {
        o: corner.br,
        d: corner.bl,
      },
      leftline: {
        o: corner.bl,
        d: corner.tl,
      },
    };
  }
  /**
   * 射线检测法：以鼠标坐标点为参照，水平向右做一条射线，求坐标点与多条边的交点个数
   * 如果和物体相交的个数为偶数点则点在物体外部；如果为奇数点则点在内部
   * 不过 fabric 的点选多边形都是用于包围盒，也就是矩形，所以该方法是专门针对矩形的，并且针对矩形做了一些优化
   */
  _findCrossPoints(ex, ey, lines) {
    let b1, // 射线的斜率
      b2, // 边的斜率
      a1,
      a2,
      xi, // 射线与边的交点
      // yi, // 射线与边的交点
      xcount = 0,
      iLine; // 当前边

    // 遍历包围盒的四条边
    for (let lineKey in lines) {
      iLine = lines[lineKey];

      // 优化1：如果边的两个端点的 y 值都小于鼠标点的 y 值，则跳过
      if (iLine.o.y < ey && iLine.d.y < ey) continue;
      // 优化2：如果边的两个端点的 y 值都大于鼠标点的 y 值，则跳过
      if (iLine.o.y >= ey && iLine.d.y >= ey) continue;

      // 优化3：如果边是一条垂线
      if (iLine.o.x === iLine.d.x && iLine.o.x >= ex) {
        xi = iLine.o.x;
        // yi = ey;
      } else {
        // 简单计算下射线与边的交点，看式子容易晕，建议自己手动算一下
        b1 = 0;
        b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x);
        a1 = ey - b1 * ex;
        a2 = iLine.o.y - b2 * iLine.o.x;

        xi = -(a1 - a2) / (b1 - b2);
        // yi = a1 + b1 * xi;
      }
      // 只需要计数 xi >= ex 的情况
      if (xi >= ex) {
        xcount += 1;
      }
      // 优化4：因为 fabric 中的多边形只需要用到矩形，所以根据矩形的特质，顶多只有两个交点，所以我们可以提前结束循环
      if (xcount === 2) {
        break;
      }
    }
    return xcount;
  }

  saveState() {
    // do some
    return this
  }

  get(key) {
    return this[key];
  }
  set(key, value) {
    if (key === 'scaleX' && value < 0) {
        this.flipX = !this.flipX;
        value *= -1;
    } else if (key === 'scaleY' && value < 0) {
        this.flipY = !this.flipY;
        value *= -1;
    }
    this[key] = value;
    return this;
  }
}
