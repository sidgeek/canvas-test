import { SHAPE_POS } from "../types/const";
import { getTransformedPoint } from "../utils/transform";
import CanvasHandler from "./CanvasHandler";
import EventsHandler from "./EventsHandler";

class Handlers {
  constructor(props) {
    const { canvas } = props;
    const handlerOptions = {
      root: this,
      canvas,
    };

    this.allShapes = [];
    this.canvasHandler = new CanvasHandler(handlerOptions);
    this.eventsHandler = new EventsHandler(handlerOptions);
  }

  add(shape) {
    shape.addRoot(this);
    shape.setCoords()
    this.allShapes.push(shape);
    this.renderAll();
  }

  renderAll() {
    this.canvasHandler.clean();
    const ctx = this.canvasHandler.getCtx()
    if (!ctx) return
    this.allShapes.forEach((s) => {
      s.render(ctx);
    });
  }

  getAllShapes() {
    return this.allShapes;
  }
}
export default Handlers;
