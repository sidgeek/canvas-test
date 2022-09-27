import { cursorMap } from "../utils/cursorHelper";
import { Util } from "../utils/Util";
import BaseHandler from "./BaseHandler";

class CanvasHandler extends BaseHandler {
  constructor(props) {
    super(props)
    this.initialize()

    this._offset = { left: 0, top: 0 }
    this.hoverCursor = 'move';
    this.defaultCursor = 'default'
    this.moveCursor = 'move'
    this.rotationCursor = 'crosshair'
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

  _shouldClearSelection() { return false }

  __onMouseUp(e) {
    var target;

    // if (this.isDrawingMode && this._isCurrentlyDrawing) {
    //   this.freeDrawing._finalizeAndAddPath();
    //   this.fire('mouse:up', { e: e });
    //   return;
    // }

    if (this._currentTransform) {
        var transform = this._currentTransform;

        target = transform.target;
        if (target._scaling) {
            target._scaling = false;
        }

        // determine the new coords everytime the image changes its position
        var i = this._objects.length;
        while (i--) {
            this._objects[i].setCoords();
        }

        target.isMoving = false;

        // only fire :modified event if target coordinates were changed during mousedown-mouseup
        if (this.stateful && target.hasStateChanged()) {
            this.fire('object:modified', { target: target });
            target.fire('modified');
        }

        if (this._previousOriginX) {
            this._currentTransform.target.adjustPosition(this._previousOriginX);
            this._previousOriginX = null;
        }
    }

    this._currentTransform = null;

    if (this._groupSelector) {
        // group selection was completed, determine its bounds
        this._findSelectedObjects(e);
    }
    var activeGroup = this.getActiveGroup();
    if (activeGroup) {
        activeGroup.setObjectsCoords();
        activeGroup.set('isMoving', false);
        this._setCursor(this.defaultCursor);
    }

    // clear selection
    this._groupSelector = null;
    this.renderAll();

    this._setCursorFromEvent(e, target);

    // fix for FF
    this._setCursor('');

    var _this = this;
    setTimeout(function () {
        _this._setCursorFromEvent(e, target);
    }, 50);

    if (target) {
        const { top, left, currentWidth, currentHeight, width, height, angle, scaleX, scaleY, originX, originY } = target;
        const obj = {
            top,
            left,
            currentWidth,
            currentHeight,
            width,
            height,
            angle,
            scaleX,
            scaleY,
            originX,
            originY,
        };
        console.log(JSON.stringify(obj, null, 4));
    }
    this.fire('mouse:up', { target, e });
    target && target.fire('mouseup', { e });
  }

  __onMouseDown(e) {
    let pointer;
    // 只处理左键点击
    let isLeftClick = 'which' in e ? e.which === 1 : e.button === 1;
    if (!isLeftClick) return;
    // ignore if some object is being transformed at this moment
    if (this._currentTransform) return;

    let target = this.findTarget(e),
        corner;
    pointer = this.getPointer(e);

    if (this._shouldClearSelection(e)) {
        this._groupSelector = {
            ex: pointer.x,
            ey: pointer.y,
            top: 0,
            left: 0,
        };
        // this.deactivateAllWithDispatch();
    } else {
        // 如果是拖拽或旋转
        // this.stateful && target.saveState();

        // if ((corner = target._findTargetCorner(e, this._offset))) {
        //     this.onBeforeScaleRotate(target);
        // }
        // if (this._shouldHandleGroupLogic(e, target)) {
        //     this._handleGroupLogic(e, target);
        //     target = this.getActiveGroup();
        // } else {
        //     if (target !== this.getActiveGroup()) {
        //         this.deactivateAll();
        //     }
        //     this.setActiveObject(target, e);
        // }

        // this._setupCurrentTransform(e, target);
    }
    // 我们必须重新渲染把当前激活的物体置于上层画布
    // this.renderAll();

    // if (corner === 'mtr') {
    //     // 如果点击的是上方的控制点，也就是旋转操作
    //     this._previousOriginX = this._currentTransform.target.originX;
    //     this._currentTransform.target.adjustPosition('center');
    //     this._currentTransform.left = this._currentTransform.target.left;
    //     this._currentTransform.top = this._currentTransform.target.top;
    // }
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
          // console.log('>>> target', target);

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