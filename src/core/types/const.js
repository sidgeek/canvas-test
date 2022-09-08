export const EVENT = {
  MouseMove: 'mousemove',
  Mousedown: 'mousedown',
  Mouseup: 'mouseup',
  Mousewheel: 'mousewheel',
}

export const iMatrix = Object.freeze([1, 0, 0, 1, 0, 0])
export const PiBy180 = Math.PI / 180;
export const halfPI = Math.PI / 2;

export const SHAPE_POS = {
  Null: 'null',
  Body: 'body',
  EL: 'edge-left',
  ER: 'edge-right',
  ET: 'edge-top',
  EB: 'edge-bottom',
  ETL: 'edge-top-left',
  ETR: 'edge-top-right',
  EBL: 'edge-bottom-left',
  EBR: 'edge-bottom-right',
}

export const CURSOR = {
  Default: 'default',
  Hand: 'hand',
  Text: 'text',
  Move: 'move',
  Pointer: 'pointer',
  E: 'e-resize', // Right(East)
  NE: 'ne-resize', // Top Right
  NW: 'nw-resize', // Top Left
  N: 'n-resize', // Top(North)
  SE: 'se-resize', // Bottom Right
  SW: 'sw-resize', // Bottom Left
  S: 's-resize', // Bottom ()
  W: 'w-resize', // Left(West)
}
