import { Point } from "../point";
import { cursorMap, MOUSE_CLICK } from "../types/const";
import { Util } from "../helpers/Util";
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

    this.stateful = false

    /** 当前激活物体 */
    this._activeObject = null
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

  _shouldClearSelection(e) { 
    let target = this.findTarget(e)
    return !target
  }

  _shouldHandleGroupLogic() { return false }

  setActiveObject(object, e) {
    if (this._activeObject) {
        // 如果当前有激活物体
        this._activeObject.setActive(false);
    }
    this._activeObject = object;
    object.setActive(true);

    this.root.renderAll();
    return this;
}

  __onMouseDown(e) {
    let pointer;
    // 只处理左键点击
    let isLeftClick = e.button === MOUSE_CLICK.LEFT;
    
    if (!isLeftClick) return;
    // ignore if some object is being transformed at this moment
    if (this._currentTransform) return;

    let target = this.findTarget(e),
      corner;
      pointer = this.getPointer(e);

    if (this._shouldClearSelection(e)) {
        // this._groupSelector = {
        //     ex: pointer.x,
        //     ey: pointer.y,
        //     top: 0,
        //     left: 0,
        // };
        this.deactivateAllWithDispatch();
    } else {
        // 如果是拖拽或旋转
        this.stateful && target.saveState();

        if ((corner = target._findTargetCorner(e, this._offset))) {
          console.log('>>> on corner', corner, pointer);
            // this.onBeforeScaleRotate(target);
        }
        if (this._shouldHandleGroupLogic(e, target)) {
            // this._handleGroupLogic(e, target);
            target = this.getActiveGroup();
        } else {
            // if (target !== this.getActiveGroup()) {
            //     this.deactivateAll();
            // }
            this.setActiveObject(target, e);
        }

        this._setupCurrentTransform(e, target);
    }
    // 我们必须重新渲染把当前激活的物体置于上层画布
    this.root.renderAll();

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
          if (target) {
              this._setCursorFromEvent(e, target);
          } else {
              style.cursor = this.defaultCursor;
          }
      } else {
          // 如果是旋转、缩放、平移等操作
          pointer = Util.getPointer(e, this.getCanvasEle());

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

  /** 主要就是清空拖蓝选区，设置物体激活状态，重新渲染画布 */
  __onMouseUp(e) {
    let target;
    if (this._currentTransform) {
        let transform = this._currentTransform;

        target = transform.target;
        if (target._scaling) {
            target._scaling = false;
        }

        // 每次物体更改都要重新计算新的控制点
        const shapes = this.root.getAllShapes()
        let i = shapes.length;
        while (i--) {
          shapes[i].setCoords();
        }

        target.isMoving = false;
    }

    this._currentTransform = null;

    if (this._groupSelector) {
        // 如果有拖蓝框选区域
        this._findSelectedObjects(e);
    }
    // clear selection
    this.root.renderAll();

    this._setCursorFromEvent(e, target);
  }

  /** 记录当前物体的变换状态 */
  _setupCurrentTransform(e, target) {
    let action = 'drag',
        corner,
        pointer = Util.getPointer(e, this.getCanvasEle());

    corner = target._findTargetCorner(e, this._offset);
    if (corner) {
        // 根据点击的控制点判断此次操作是什么
        action = corner === 'ml' || corner === 'mr' ? 'scaleX' : corner === 'mt' || corner === 'mb' ? 'scaleY' : corner === 'mtr' ? 'rotate' : 'scale';
    }

    let originX = 'center',
        originY = 'center';

    if (corner === 'ml' || corner === 'tl' || corner === 'bl') {
        // 如果点击的是左边的控制点，则变换基点就是右边，以右边为基准向左变换
        originX = 'right';
    } else if (corner === 'mr' || corner === 'tr' || corner === 'br') {
        originX = 'left';
    }

    if (corner === 'tl' || corner === 'mt' || corner === 'tr') {
        // 如果点击的是上方的控制点，则变换基点就是底部，以底边为基准向上变换
        originY = 'bottom';
    } else if (corner === 'bl' || corner === 'mb' || corner === 'br') {
        originY = 'top';
    }

    if (corner === 'mtr') {
        // 如果是旋转操作，则基点就是中心点
        originX = 'center';
        originY = 'center';
    }

    // let center = target.getCenterPoint();
    this._currentTransform = {
        target,
        action,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        offsetX: pointer.x - target.left,
        offsetY: pointer.y - target.top,
        originX,
        originY,
        ex: pointer.x,
        ey: pointer.y,
        left: target.left,
        top: target.top,
        theta: Util.degreesToRadians(target.angle),
        width: target.width * target.scaleX,
        mouseXSign: 1,
        mouseYSign: 1,
    };
    // 记录物体原始的 original 变换参数
    this._currentTransform.original = {
        left: target.left,
        top: target.top,
        scaleX: target.scaleX,
        scaleY: target.scaleY,
        originX,
        originY,
    };
    let { target: target2, ...other } = this._currentTransform;
    console.log(JSON.stringify(other, null, 4));

      // this._resetCurrentTransform(e); // 好像没必要重新赋值？除非按下了 altKey 键
  }

  /** 平移当前选中物体，注意这里我们没有用 += */
  _translateObject(x, y) {
    // console.log(this._currentTransform.offsetX, this._currentTransform.offsetY, this._offset.top, this._offset.left);
    let target = this._currentTransform.target;
    target.set('left', x - this._currentTransform.offsetX);
    target.set('top', y - this._currentTransform.offsetY);
  }

      /**
     * 缩放当前选中物体
     * @param x 鼠标点 x
     * @param y 鼠标点 y
     * @param by 是否等比缩放，x | y | equally
     */
    _scaleObject(x, y, by = 'equally') {
        let t = this._currentTransform,
            offset = this._offset,
            target = t.target;

        // 缩放基点：比如拖拽右边中间的控制点，其实我们参考的变换基点是左边中间的控制点
        let constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);
        // 以物体变换中心为原点的鼠标点坐标值
        let localMouse = target.toLocalPoint(new Point(x - offset.left, y - offset.top), t.originX, t.originY);

        if (t.originX === 'right') {
            localMouse.x *= -1;
        } else if (t.originX === 'center') {
            localMouse.x *= t.mouseXSign * 2;

            if (localMouse.x < 0) {
                t.mouseXSign = -t.mouseXSign;
            }
        }

        if (t.originY === 'bottom') {
            localMouse.y *= -1;
        } else if (t.originY === 'center') {
            localMouse.y *= t.mouseYSign * 2;

            if (localMouse.y < 0) {
                t.mouseYSign = -t.mouseYSign;
            }
        }

        // 计算新的缩放值，以变换中心为原点，根据本地鼠标坐标点/原始宽度进行计算，重新设定物体缩放值
        let newScaleX = target.scaleX,
            newScaleY = target.scaleY;
        if (by === 'equally') {
            let dist = localMouse.y + localMouse.x;
            let lastDist = target.height * t.original.scaleY + target.width * t.original.scaleX + target.padding * 2 - target.strokeWidth * 2 + 1; /* additional offset needed probably due to subpixel rendering, and avoids jerk when scaling an object */

            // We use t.scaleX/Y instead of target.scaleX/Y because the object may have a min scale and we'll loose the proportions
            newScaleX = (t.original.scaleX * dist) / lastDist;
            newScaleY = (t.original.scaleY * dist) / lastDist;

            target.set('scaleX', newScaleX);
            target.set('scaleY', newScaleY);
        } else if (!by) {
            newScaleX = localMouse.x / (target.width + target.padding);
            newScaleY = localMouse.y / (target.height + target.padding);

            target.set('scaleX', newScaleX);
            target.set('scaleY', newScaleY);
        } else if (by === 'x') {
            newScaleX = localMouse.x / (target.width + target.padding);
            target.set('scaleX', newScaleX);
        } else if (by === 'y') {
            newScaleY = localMouse.y / (target.height + target.padding);
            target.set('scaleY', newScaleY);
        }
        // 如果是反向拉伸 x
        if (newScaleX < 0) {
            if (t.originX === 'left') t.originX = 'right';
            else if (t.originX === 'right') t.originX = 'left';
        }
        // 如果是反向拉伸 y
        if (newScaleY < 0) {
            if (t.originY === 'top') t.originY = 'bottom';
            else if (t.originY === 'bottom') t.originY = 'top';
        }

        // console.log(constraintPosition, localMouse, t.originX, t.originY);

        // 缩放会改变物体位置，所以要重新设置
        target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
    }

  /** 重置当前 transform 状态为 original，并设置 resizing 的基点 */
  _resetCurrentTransform(e) {
    let t = this._currentTransform;

    t.target.set('scaleX', t.original.scaleX);
    t.target.set('scaleY', t.original.scaleY);
    t.target.set('left', t.original.left);
    t.target.set('top', t.original.top);

    if (e.altKey) {
        if (t.originX !== 'center') {
            if (t.originX === 'right') {
                t.mouseXSign = -1;
            } else {
                t.mouseXSign = 1;
            }
        }
        if (t.originY !== 'center') {
            if (t.originY === 'bottom') {
                t.mouseYSign = -1;
            } else {
                t.mouseYSign = 1;
            }
        }

        t.originX = 'center';
        t.originY = 'center';
    } else {
        t.originX = t.original.originX;
        t.originY = t.original.originY;
    }
  }

  /** 使所有元素失活，并触发相应事件 */
  deactivateAllWithDispatch() {
    this.deactivateAll();
    return this;
  }

  /** 将所有物体设置成未激活态 */
  deactivateAll() {
    let allObjects = this.root.getAllShapes(),
        i = 0,
        len = allObjects.length;
    for (; i < len; i++) {
        allObjects[i].setActive(false);
    }
    // this.discardActiveGroup();
    // this.discardActiveObject();
    return this;
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