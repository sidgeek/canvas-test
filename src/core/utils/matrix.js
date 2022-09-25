import { cos } from "./cos";
import { sin } from "./sin";
import { degreesToRadians } from "./radiansDegreesConversion";
import { iMatrix, PiBy180 } from "../types/const";
import { Point2d } from "../point2d";


/**
 * Apply transform t to point p
 * @static
 * @memberOf fabric.util
 * @param  {Point2d | IPoint} p The point to transform
 * @param  {Array} t The transform
 * @param  {Boolean} [ignoreOffset] Indicates that the offset should not be applied
 * @return {Point2d} The transformed point
 */
export const transformPoint = (p, t, ignoreOffset) => new Point2d(p.x, p.y).transform(t, ignoreOffset);

/**
 * Invert transformation t
 * @static
 * @memberOf fabric.util
 * @param {Array} t The transform
 * @return {Array} The inverted transform
 */
export const invertTransform = (t) => {
  const a = 1 / (t[0] * t[3] - t[1] * t[2]),
        r = [a * t[3], -a * t[1], -a * t[2], a * t[0], 0, 0],
        { x, y } = transformPoint(new Point2d(t[4], t[5]), r, true);
  r[4] = -x;
  r[5] = -y;
  return r;
};

/**
 * Multiply matrix A by matrix B to nest transformations
 * @static
 * @memberOf fabric.util
 * @param  {TMat2D} a First transformMatrix
 * @param  {TMat2D} b Second transformMatrix
 * @param  {Boolean} is2x2 flag to multiply matrices as 2x2 matrices
 * @return {TMat2D} The product of the two transform matrices
 */
export const multiplyTransformMatrices = (a, b, is2x2) => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  is2x2 ? 0 : a[0] * b[4] + a[2] * b[5] + a[4],
  is2x2 ? 0 : a[1] * b[4] + a[3] * b[5] + a[5]
];

/**
 * Decomposes standard 2x3 matrix into transform components
 * @static
 * @memberOf fabric.util
 * @param  {TMat2D} a transformMatrix
 * @return {Object} Components of transform
 */
export const qrDecompose = (a) => {
  const angle = Math.atan2(a[1], a[0]),
        denom = Math.pow(a[0], 2) + Math.pow(a[1], 2),
        scaleX = Math.sqrt(denom),
        scaleY = (a[0] * a[3] - a[2] * a[1]) / scaleX,
        skewX = Math.atan2(a[0] * a[2] + a[1] * a [3], denom);
  return {
    angle: angle / PiBy180,
    scaleX,
    scaleY,
    skewX: skewX / PiBy180,
    skewY: 0,
    translateX: a[4],
    translateY: a[5]
  };
};

/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * @static
 * @memberOf fabric.util
 * @param  {Object} options
 * @param  {Number} [options.angle] angle in degrees
 * @return {TMat2D} transform matrix
 */

export const calcRotateMatrix = ({ angle }) => {
  if (!angle) {
    return iMatrix;
  }
  const theta = degreesToRadians(angle),
        cosin = cos(theta),
        sinus = sin(theta);
  return [cosin, sinus, -sinus, cosin, 0, 0];
};

/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet.
 * is called DimensionsTransformMatrix because those properties are the one that influence
 * the size of the resulting box of the object.
 * @static
 * @memberOf fabric.util
 * @param  {Object} options
 * @param  {Number} [options.scaleX]
 * @param  {Number} [options.scaleY]
 * @param  {Boolean} [options.flipX]
 * @param  {Boolean} [options.flipY]
 * @param  {Number} [options.skewX]
 * @param  {Number} [options.skewY]
 * @return {Number[]} transform matrix
 */
export const calcDimensionsMatrix = ({
  scaleX = 1,
  scaleY = 1,
  flipX = false,
  flipY = false,
  skewX = 0,
  skewY = 0,
}) => {
  let scaleMatrix = iMatrix;
  if ( scaleX !== 1 || scaleY !== 1 || flipX || flipY ) {
    scaleMatrix = [
      flipX ? -scaleX : scaleX,
      0,
      0,
      flipY ? -scaleY : scaleY,
      0,
      0
    ];
  }
  if (skewX) {
    scaleMatrix = multiplyTransformMatrices(
      scaleMatrix,
      [1, 0, Math.tan(degreesToRadians(skewX)), 1],
      true);
  }
  if (skewY) {
    scaleMatrix = multiplyTransformMatrices(
      scaleMatrix,
      [1, Math.tan(degreesToRadians(skewY)), 0, 1],
      true);
  }
  return scaleMatrix;
};

/**
 * Returns a transform matrix starting from an object of the same kind of
 * the one returned from qrDecompose, useful also if you want to calculate some
 * transformations from an object that is not enlived yet
 * @static
 * @memberOf fabric.util
 * @param  {Object} options
 * @param  {Number} [options.angle]
 * @param  {Number} [options.scaleX]
 * @param  {Number} [options.scaleY]
 * @param  {Boolean} [options.flipX]
 * @param  {Boolean} [options.flipY]
 * @param  {Number} [options.skewX]
 * @param  {Number} [options.skewY]
 * @param  {Number} [options.translateX]
 * @param  {Number} [options.translateY]
 * @return {Number[]} transform matrix
 */

export const composeMatrix = ({ translateX = 0, translateY = 0, angle = 0, ...otherOptions }) => {
  let matrix = [1, 0, 0, 1, translateX, translateY];
  if (angle) {
    matrix = multiplyTransformMatrices(matrix, calcRotateMatrix({ angle }));
  }
  const scaleMatrix = calcDimensionsMatrix(otherOptions);
  if (scaleMatrix !== iMatrix) {
    matrix = multiplyTransformMatrices(matrix, scaleMatrix);
  }
  return matrix;
};

