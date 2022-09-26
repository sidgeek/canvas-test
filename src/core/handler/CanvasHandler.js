import { cursorMap } from "../utils/cursorHelper";
import { Util } from "../utils/Util";
import BaseHandler from "./BaseHandler";

class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()

    this._offset = { left: 0, top: 0 }
  }

  initialize() {
    const canvasEle = this.getCanvasEle()
    canvasEle.width = this.canvas.width
    canvasEle.height = this.canvas.height
    canvasEle.style.border = '1px solid red'
  }


  clean() {
    const context = this.getCtx()
    context.save();
    context.setTransform(1,0,0,1,0,0);
    context.clearRect(0,0, this.canvas.width, this.canvas.height);
    context.restore();
  }

  getCanvasEle() {
    return this.canvas._canvas
  }

  getCtx() {
    return this.canvas.ctx
  }

  /** 设置鼠标样式 */
  updateCursor(value) {
    const canvas = this.getCanvasEle()
    canvas.style.cursor = value
  }

  /** 如果当前的物体在当前的组内，则要考虑扣去组的 top、left 值 */
  _normalizePointer(object, pointer) {
    let x = pointer.x,
        y = pointer.y;
    return { x, y };
  }
  getPointer(e) {
    let pointer = Util.getPointer(e, this.getCanvasEle());
    return {
        x: pointer.x - this._offset.left,
        y: pointer.y - this._offset.top,
    };
  }

  containsPoint(e, target) {
    let pointer = this.getPointer(e),
        xy = this._normalizePointer(target, pointer),
        x = xy.x,
        y = xy.y;

    // 等待去除
    // we iterate through each object. If target found, return it.
    // debugger
    let iLines = target._getImageLines(target.oCoords),
        xpoints = target._findCrossPoints(x, y, iLines);
    
    // // if xcount is odd then we clicked inside the object
    // // For the specific case of square images xcount === 1 in all true cases
    if ((xpoints && xpoints % 2 === 1) || target._findTargetCorner(e, this._offset)) {
        return true;
    }
    return false;
  }


  /** 检测是否有物体在鼠标位置 */
  findTarget(e) {
    let target;

    // 遍历所有物体，判断鼠标点是否在物体包围盒内
    const shapes = this.root.getAllShapes()
    for (let i = shapes.length; i--; ) {
        if (shapes[i] && this.containsPoint(e, shapes[i])) {
            target = shapes[i];
            break;
        }
    }

    if (target) return target;
  }

  /** 处理鼠标 hover 事件和物体变换时的拖拽事件
   * 如果是涂鸦模式，只绘制 upper-canvas
   * 如果是图片变换，只绘制 upper-canvas */
  __onMouseMove(e) {
      let target, pointer;

      if (!this._currentTransform) {
          // 如果是 hover 事件，这里我们只需要改变鼠标样式，并不会重新渲染
          let style = this.getCanvasEle().style;
          target = this.findTarget(e);
          console.log('>>> target', target);

          if (target) {
              this._setCursorFromEvent(e, target);
          } else {
              style.cursor = this.defaultCursor;
          }
      } else {
          // 如果是旋转、缩放、平移等操作
          pointer = Util.getPointer(e, this.upperCanvasEl);

          let x = pointer.x,
              y = pointer.y;

          this._currentTransform.target.isMoving = true;

          let t = this._currentTransform,
              reset = false;

          if (this._currentTransform.action === 'rotate') {
          } else if (this._currentTransform.action === 'scale') {
              // 如果是整体缩放操作
              if (e.shiftKey) {
                  this._currentTransform.currentAction = 'scale';
                  this._scaleObject(x, y);
              } else {
                  if (!reset && t.currentAction === 'scale') {
                      // Switch from a normal resize to proportional
                      this._resetCurrentTransform(e);
                  }

                  this._currentTransform.currentAction = 'scaleEqually';
                  this._scaleObject(x, y, 'equally');
              }
          } else if (this._currentTransform.action === 'scaleX') {
              // 如果只是缩放 x
              this._scaleObject(x, y, 'x');
          } else if (this._currentTransform.action === 'scaleY') {
              // 如果只是缩放 y
              this._scaleObject(x, y, 'y');
          } else {
              // 如果是拖拽物体
              this._translateObject(x, y);
              this._setCursor(this.moveCursor);
          }

          this.root.renderAll();
      }
  }

    /** 设置鼠标样式 */
  _setCursor(value) {
    const canvas = this.getCanvasEle()
    canvas.style.cursor = value
  }

  /** 根据鼠标位置来设置相应的鼠标样式 */
  _setCursorFromEvent(e, target) {
      let s = this.getCanvasEle().style;
      if (target) {
          let corner =  target._findTargetCorner(e, this._offset);

          if (corner) {
              corner = corner;
              if (corner in cursorMap) {
                  s.cursor = cursorMap[corner];
              } else if (corner === 'mtr' && target.hasRotatingPoint) {
                  s.cursor = this.rotationCursor;
              } else {
                  s.cursor = this.defaultCursor;
                  return false;
              }
          } else {
              s.cursor = this.hoverCursor;
          }
          return true;
      } else {
          s.cursor = this.defaultCursor;
          return false;
      }
  }
}

export default CanvasHandler