import { sin } from './sin';
import { cos } from './cos';
import { Point } from '../point';

/**
 * Rotates `vector` with `radians`
 * @static
 * @memberOf fabric.util
 * @param {Point} vector The vector to rotate (x and y)
 * @param {Number} radians The radians of the angle for the rotation
 * @return {Point} The new rotated point
 */
export const rotateVector = (vector, radians) => {
  const sinus = sin(radians),
        cosinus = cos(radians);
  return new Point(
    vector.x * cosinus - vector.y * sinus,
    vector.x * sinus + vector.y * cosinus,
  );
};

/**
 * Creates a vetor from points represented as a point
 * @static
 * @memberOf fabric.util
 *
 * @param {Point} from
 * @param {Point} to
 * @returns {Point} vector
 */
export const createVector = (from, to) => new Point(to).subtract(from);

    /**
     * Calculates angle between 2 vectors using dot product
     * @static
     * @memberOf fabric.util
     * @param {Point} a
     * @param {Point} b
     * @returns the angle in radian between the vectors
     */
export const calcAngleBetweenVectors = (a, b) =>
  Math.acos((a.x * b.x + a.y * b.y) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y)));

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} v
 * @returns {Point} vector representing the unit vector of pointing to the direction of `v`
 */
export const getHatVector = (v) => v.scalarMultiply(1 / Math.hypot(v.x, v.y));

/**
 * @static
 * @memberOf fabric.util
 * @param {Point} A
 * @param {Point} B
 * @param {Point} C
 * @returns {{ vector: Point, angle: number }} vector representing the bisector of A and A's angle
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
