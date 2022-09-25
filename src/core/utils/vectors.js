import { sin } from './sin';
import { cos } from './cos';
import { Point2d } from '../point2d';

/**
 * Rotates `vector` with `radians`
 * @static
 * @memberOf fabric.util
 * @param {Point2d} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point2d} The new rotated point
 */
export const rotateVector = (vector, radians) => {
  const sinus = sin(radians),
        cosinus = cos(radians);
  return new Point2d(
    vector.x * cosinus - vector.y * sinus,
    vector.x * sinus + vector.y * cosinus,
  );
};

/**
 * Creates a vetor from points represented as a point
 * @static
 * @memberOf fabric.util
 *
 * @param {Point2d} from
 * @param {Point2d} to
 * @returns {Point2d} vector
 */
export const createVector = (from, to) => new Point2d(to).sub(from);

    /**
     * Calculates angle between 2 vectors using dot product
     * @static
     * @memberOf fabric.util
     * @param {Point2d} a
     * @param {Point2d} b
     * @returns the angle in radian between the vectors
     */
export const calcAngleBetweenVectors = (a, b) =>
  Math.acos((a.x * b.x + a.y * b.y) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y)));

/**
 * @static
 * @memberOf fabric.util
 * @param {Point2d} v
 * @returns {Point2d} vector representing the unit vector of pointing to the direction of `v`
 */
export const getHatVector = (v) => v.scalarMultiply(1 / Math.hypot(v.x, v.y));

/**
 * @static
 * @memberOf fabric.util
 * @param {Point2d} A
 * @param {Point2d} B
 * @param {Point2d} C
 * @returns {{ vector: Point2d, angle: number }} vector representing the bisector of A and A's angle
 */
export const getBisector = (a, b, c) => {
  const ab = createVector(a, b), ac = createVector(a, c);
  const alpha = calcAngleBetweenVectors(ab, ac);
  //  check if alpha is relative to AB->BC
  const ro = calcAngleBetweenVectors(
    rotateVector(ab, alpha),
    ac
  );
  const phi = alpha * (ro === 0 ? 1 : -1) / 2;
  return {
    vector: getHatVector(rotateVector(ab, phi)),
    angle: alpha
  };
};
