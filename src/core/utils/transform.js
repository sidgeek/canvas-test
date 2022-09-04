import { Point2d } from "../point2d";

export function getTransformedPoint(context, x, y) {
  const transform = context.getTransform();
  const inverseZoom = 1 / transform.a;
  
  const transformedX = inverseZoom * x - inverseZoom * transform.e;
  const transformedY = inverseZoom * y - inverseZoom * transform.f;
  return new Point2d(transformedX, transformedY);
}
