import { Point } from "../point";

export function getTransformedPoint(context, x, y) {
  const transform = context.getTransform();
  const inverseZoom = 1 / transform.a;
  
  const transformedX = inverseZoom * x - inverseZoom * transform.e;
  const transformedY = inverseZoom * y - inverseZoom * transform.f;
  return new Point(transformedX, transformedY);
}


export function getTransformedDistance(context, move) {
  const transform = context.getTransform();
  
  const x = move.x / transform.a;
  const y = move.y / transform.a;
  return {x, y};
}
