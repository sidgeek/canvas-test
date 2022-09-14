import { SHAPE_POS } from "../types/const";
import { getTransformedPoint } from "../utils/transform";
import CanvasHandler from "./CanvasHandler";
import DragHandler from "./DragHandler";
import EventsHandler from "./EventsHandler";
import ZoomHandler from "./ZoomHandler";

class Handlers {
  constructor(props) {
    const { canvas } = props;
    const handlerOptions = {
      root: this,
      canvas,
    };

    this.allShapes = [];
    this.pointerPos = null;
    this.changedPointerPos = null;

    this.canvasHandler = new CanvasHandler(handlerOptions);
    this.dragHandler = new DragHandler(handlerOptions);
    this.eventsHandler = new EventsHandler(handlerOptions);
    this.zoomHandler = new ZoomHandler(handlerOptions);
  }

  setPointerPosition(point) {
    this.pointerPos = point;
    this.changedPointerPos = point;
  }

  getPointerPosition() {
    return this.changedPointerPos;
  }

  getPointerCanvasPosition() {
    const pos = this.getPointerPosition()
    return getTransformedPoint(this.canvasHandler.getCtx(), pos.x, pos.y)
  }

  add(shape) {
    shape.addRoot(this);
    this.allShapes.push(shape);
    this.renderAll();
  }

  scale(shape, ratio) {
    shape.updateScale(ratio);
    this.renderAll();
  }

  scaleByShapePos(shape, posType, pointPos, ratio) {
    if (posType === SHAPE_POS.ETL) {
      // 更新x, y
      shape.updateXY(pointPos.x, pointPos.y)
    } else if (posType === SHAPE_POS.ETR) {
      // 更新y
      shape.updateY(pointPos.y)
    } else if (posType === SHAPE_POS.EBL) {
      // 更新x
      shape.updateX(pointPos.x)
    } else if (posType === SHAPE_POS.EBR) {
      // 不需要更新
    }
    shape.updateScale(ratio);
    this.renderAll();
  }

  renderAll() {
    this.canvasHandler.clean();
    this.allShapes.forEach((s) => {
      s.render();
    });
  }

  getAllShapes() {
    return this.allShapes;
  }
}
export default Handlers;
