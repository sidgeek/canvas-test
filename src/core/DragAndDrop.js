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
  /**
   *  number,
    {
      node: Node;
      startPointerPos: Vector2d;
      offset: Vector2d;
      pointerId?: number;
      dragStatus: 'ready' | 'dragging' | 'stopped';
    }
   */
  _dragElements: new Map(),

  // methods
  _drag(evt) {
    // Array<Node>
    const nodesToFireEvents = [];
    DD._dragElements.forEach((elem, key) => {
      const { node } = elem;
      const { root } = node

      // console.log('>>> node', node);

      // we need to find pointer relative to that node
      // const stage = node.getStage();
      
      // stage.setPointersPositions(evt);

      // it is possible that user call startDrag without any event
      // it that case we need to detect first movable pointer and attach it into the node
      if (elem.pointerId === undefined) {
        // elem.pointerId = Util._getFirstPointerId(evt);
      }
      // const pos = stage._changedPointerPositions.find(
      //   (pos) => pos.id === elem.pointerId
      // );

      const pos = root.getPointerPosition()

      // not related pointer
      if (!pos) {
        return;
      }

   
      if (elem.dragStatus !== 'dragging') {
        // var dragDistance = node.dragDistance(); // 移动了多少才算移动
        var dragDistance = 10; //
        var distance = Math.max(
          Math.abs(pos.x - elem.startPointerPos.x),
          Math.abs(pos.y - elem.startPointerPos.y)
        );
        if (distance < dragDistance) {
          return;
        }
        node.startDrag({ evt });
        // a user can stop dragging inside `dragstart`
        if (!node.isDragging()) {
          return;
        }
      }
      node._setDragPosition(evt, elem);
      // nodesToFireEvents.push(node);
    });
    // call dragmove only after ALL positions are changed
    // nodesToFireEvents.forEach((node) => {
    //   node.fire(
    //     'dragmove',
    //     {
    //       type: 'dragmove',
    //       target: node,
    //       evt: evt,
    //     },
    //     true
    //   );
    // });
  },

  // dragBefore and dragAfter allows us to set correct order of events
  // setup all in dragbefore, and stop dragging only after pointerup triggered.
  _endDragBefore(evt) {
    // const drawNodes = [];
    DD._dragElements.forEach((elem) => {
      const { node } = elem;
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

      // if (drawNode && drawNodes.indexOf(drawNode) === -1) {
      //   drawNodes.push(drawNode);
      // }
    });
    // // render in a sync way
    // // because mousemove event may trigger BEFORE batch render is called
    // // but as we have not hit canvas updated yet, it will trigger incorrect mouseover/mouseout events
    // drawNodes.forEach((drawNode) => {
    //   drawNode.render();
    // });
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