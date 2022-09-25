import { getTransformedPoint } from "../utils/transform";

export const DD = {
  get isDragging() {
    var flag = false;
    DD._dragElements.forEach((elem) => {
      if (elem.dragStatus === 'dragging') {
        flag = true;
      }
    });
    return flag;
  },
  justDragged: false,
  get node() {
    // return first dragging node
    var node;
    DD._dragElements.forEach((elem) => {
      node = elem.node;
    });
    return node;
  },
  _dragElements: new Map(),

  // drag & drop
  _createDragElement(startPointerPos, node) {
    // shape 的起始位置
    const ap = node.getStartPoint()

    DD._dragElements.set(node._id, {
      node,
      startPointerPos,
      offset: {
        x: startPointerPos.x - ap.x,
        y: startPointerPos.y - ap.y,
      },
      dragStatus: 'ready',
      pointerId: node._id,
    });
  },

  // methods
  _drag(evt) {
    DD._dragElements.forEach((elem, key) => {
      const { node } = elem;
      const pos = node.root.getPointerPosition()
      if (!pos) { return;}

      if (elem.dragStatus !== 'dragging') {
        // var dragDistance = node.dragDistance(); // 移动了多少才算移动
        const dragDistance = 10; //
        const canvasPos = getTransformedPoint(node.ctx, pos.x, pos.y)
        var distance = Math.max(
          Math.abs(canvasPos.x - elem.startPointerPos.x),
          Math.abs(canvasPos.y - elem.startPointerPos.y)
        );

        // console.log('>>> distance', distance);
        if (distance < dragDistance) {
          return;
        }
        
        // 设置开始拖动状态
        elem.dragStatus = 'dragging';
      }
      node._setDragPosition(elem);
    });;
  },

  // dragBefore and dragAfter allows us to set correct order of events
  // setup all in dragbefore, and stop dragging only after pointerup triggered.
  _endDragBefore(evt) {
    // const drawNodes = [];
    DD._dragElements.forEach((elem) => {
      // const { node } = elem;
      // we need to find pointer relative to that node
      // const stage = node.getStage();
      // if (evt) {
      //   stage.setPointersPositions(evt);
      // }

      // const pos = stage._changedPointerPositions.find(
      //   (pos) => pos.id === elem.pointerId
      // );

      // that pointer is not related
      // if (!pos) {
      //   return;
      // }

      if (elem.dragStatus === 'dragging' || elem.dragStatus === 'stopped') {
        // if a node is stopped manually we still need to reset events:
        DD.justDragged = true;
        elem.dragStatus = 'stopped';
      }
    });
  },
  _endDragAfter(evt) {
    DD._dragElements.forEach((elem, key) => {
      if (elem.dragStatus !== 'dragging') {
        // console.log('>>> delete before', DD._dragElements.size)
        DD._dragElements.delete(key);
        // console.log('>>> delete after', DD._dragElements.size)
      }
    });
  },
};


window.addEventListener('mouseup', DD._endDragBefore, true);
window.addEventListener('touchend', DD._endDragBefore, true);

window.addEventListener('mousemove', DD._drag);
window.addEventListener('touchmove', DD._drag);

window.addEventListener('mouseup', DD._endDragAfter, false);
window.addEventListener('touchend', DD._endDragAfter, false);