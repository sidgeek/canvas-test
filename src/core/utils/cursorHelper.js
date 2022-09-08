import { CURSOR, SHAPE_POS } from "../types/const";

const ShapePos_Cursor_Map = new Map([
  [SHAPE_POS.Null, CURSOR.Default],
  [SHAPE_POS.Body, CURSOR.Move],
  [SHAPE_POS.ETL, CURSOR.NW],
  [SHAPE_POS.ETR, CURSOR.NE],
  [SHAPE_POS.EBL, CURSOR.SW],
  [SHAPE_POS.EBR, CURSOR.SE],
  [SHAPE_POS.ET, CURSOR.N],
  [SHAPE_POS.EB, CURSOR.S],
  [SHAPE_POS.EL, CURSOR.W],
  [SHAPE_POS.ER, CURSOR.E],
])

export const getShapePosCursor = (pos) => {
  return ShapePos_Cursor_Map.get(pos)
}