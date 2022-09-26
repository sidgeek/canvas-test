import { Point } from "../point2d"
import { SHAPE_POS } from '../types/const'
import mathHelper from "../utils/mathHelper"
import { Util } from "../utils/Util"

// 图形的基类
export class Shape {
  constructor(props) {
    const { canvas, left, top, width, height } = props
    this._id = Shape.getId()
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
    this.oCoords = []

    this.isHovering = false
    this.isSelected = false
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

  static LastHoverId = null
  static LastSelectedShapes = []

  static ShapeHoverPos = SHAPE_POS.Null
  static ShapeMouseDownPos = SHAPE_POS.Null

  static getId() {
    return Shape.id++
  }

  static checkIsHoverIdUpdate(currentId) {
    const isChange = (Shape.LastHoverId !== currentId)
    Shape.LastHoverId = currentId
    return isChange
  }

  static checkIsShapePosUpdate(currentShapePos) {
    const isChange = (Shape.ShapeHoverPos !== currentShapePos)
    Shape.ShapeHoverPos = currentShapePos
    return isChange
  }

  static cleanLastSelectedShapes() {
    Shape.LastSelectedShapes.map(s => s.updateIsSelected(false))
    Shape.LastSelectedShapes = []
  }

  static addLastSelectedShapes(shape) {
    Shape.cleanLastSelectedShapes()
    Shape.LastSelectedShapes.push(shape)
  }

  static getLastSelectedShapes(shape) {
    return Shape.LastSelectedShapes
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


    if (this.isHovering && this.isSelected) {
      this.drawBoard()
      this.drawControls()
    } else if (this.isSelected) {
      this.drawControls()
    } else if (this.isHovering) {
      this.drawBoard()
    }

    ctx.restore();
  }

  scaleByTopLeft(){
    const ctx = this.ctx
    ctx.translate(this.topLeft.x, this.topLeft.y)
    ctx.scale(this.scaleX, this.scaleY);
    ctx.translate(-this.topLeft.x, -this.topLeft.y)
  }

  scaleByPoint(){
    const ctx = this.ctx
    const trX = this.x
    const trY = this.y
    ctx.translate(trX, trY)
    ctx.scale(this.scaleX, this.scaleY);
    ctx.translate(-trX, -trY)
  }

  drawBoard() {
    const ctx = this.ctx
    const { x, y, width, height } = this
    ctx.save()
    this.scaleByPoint()
    ctx.strokeStyle = Shape.BorderColor
    ctx.lineWidth = Shape.BorderWidth
    const b = Shape.BorderPadding
    const b_2 = b * 2
    ctx.strokeRect(x - b, y - b, width + b_2, height + b_2)
    ctx.restore()
  }

  getControlPoints(scale = 1) {
    const { x, y, width: w, height: h } = this
    const width = w * scale
    const height = h * scale
    const r = 10
    const hr = r / 2

    const points = [
      { x: x - hr, y: y - hr },
      { x: x + width - hr, y: y - hr },
      { x: x + width - hr, y: y + height - hr },
      { x: x - hr, y: y + height - hr }
    ]

    return { points, r }
  }

  drawControls() {
    const ctx = this.ctx
    const { x, y, width, height } = this
    ctx.save()
    this.scaleByPoint()

    ctx.strokeStyle = Shape.ControlColor
    const b = Shape.ControlPadding
    const b_2 = b * 2
    
    ctx.strokeRect(x - b, y - b, width + b_2, height + b_2)

    const { points, r } = this.getControlPoints()
    points.forEach(p => {
      ctx.strokeRect(p.x, p.y, r, r)
    })

    ctx.restore()
  }

  getStartPoint() {
    return {
      x: this.x,
      y: this.y
    }
  }

  updateX(v) {
    this.x = v
  }

  updateY(v) {
    this.y = v
  }

  updateXY(v1, v2) {
    this.x = v1
    this.y = v2
  }

  updateIsHovering(status) {
    this.isHovering = status
    return this._id
  }

  updateScale(ratio) {
    console.log('>>> this.scaleX', this.scaleX);
  }

  updateIsSelected(status) {
    this.isSelected = status
  }

  getShapePosByControlId(id) {
    switch (id) {
      case 1: return SHAPE_POS.ETL
      case 2: return SHAPE_POS.ETR
      case 3: return SHAPE_POS.EBR
      case 4: return SHAPE_POS.EBL
      default: return SHAPE_POS.Null
    }
  }

  getScalePosByShapePos(shapePos) {
    const { x, y, width, height } = this
    switch (shapePos) {
      case SHAPE_POS.ETL: return { x: x + width, y: y + height }
      case SHAPE_POS.ETR: return { x, y: y + height }
      case SHAPE_POS.EBR: return { x, y }
      case SHAPE_POS.EBL: return { x: x + width, y } 
      default: return { x: 0, y: 0 }
    }
  }

  getDragPosByShapePos(shapePos) {
    const { x, y, width, height } = this
    switch (shapePos) {
      case SHAPE_POS.ETL: return { x, y }
      case SHAPE_POS.ETR: return { x: x + width, y }
      case SHAPE_POS.EBR: return { x: x + width, y: y + height }
      case SHAPE_POS.EBL: return { x, y: y + height }
      default: return { x: 0, y: 0 }
    }
  }

  isPointInControlPoint(point) {
    const { r, points } = this.getControlPoints(this.scaleX)
    // 是否在控制点上
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      if (Math.abs(point.x - p.x) <= r && Math.abs(point.y - p.y) <= r) {
        const pos = this.getShapePosByControlId(i+1)
        return { shapePos: pos }
      }
    }

    // 是否在边上
    let pos = SHAPE_POS.Null
    const hr = r / 2
    if (mathHelper.getPointToLineDis(points[0], points[1], point) < hr) {
      pos = SHAPE_POS.ET
    } else if (mathHelper.getPointToLineDis(points[1], points[2], point) < hr) {
      pos = SHAPE_POS.ER
    } else if (mathHelper.getPointToLineDis(points[2], points[3], point) < hr) {
      pos = SHAPE_POS.EB
    } else if (mathHelper.getPointToLineDis(points[3], points[0], point) < hr) {
      pos = SHAPE_POS.EL
    }

    return { shapePos: pos }
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

  setAbsolutePosition(pos) {
    this.x = pos.x
    this.y = pos.y

    return this
  }

  _setDragPosition(elem) {
    // 当前鼠标对应的canvas坐标
    const canvasPos =this.root.getPointerCanvasPosition()
    const shapePos = Shape.ShapeMouseDownPos

    if (!canvasPos || (shapePos !== SHAPE_POS.Body)) return
    
    const moveX = canvasPos.x - elem.offset.x
    const moveY = canvasPos.y - elem.offset.y

    var newNodePos = { x: moveX, y: moveY }

    if (
      !this._lastPos ||
      this._lastPos.x !== newNodePos.x ||
      this._lastPos.y !== newNodePos.y
    ) {
      this.setAbsolutePosition(newNodePos);
      this.root.renderAll()
    }

    this._lastPos = newNodePos;
  }


  getMouse(evt) {
    return new Point(evt.offsetX, evt.offsetY)
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

  get center() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2};
  }

  get topLeft() {
    return { x: this.x, y: this.y };
  }
}
