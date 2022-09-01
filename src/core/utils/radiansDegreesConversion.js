import { PiBy180 } from "../const";

/**
 * Transforms degrees to radians.
 * @static
 * @memberOf fabric.util
 * @param {TDegree} degrees value in degrees
 * @return {TRadian} value in radians
 */
export const degreesToRadians = (degrees) => (degrees * PiBy180);

/**
 * Transforms radians to degrees.
 * @static
 * @memberOf fabric.util
 * @param {TRadian} radians value in radians
 * @return {TDegree} value in degrees
 */
export const radiansToDegrees = (radians) => (radians / PiBy180);
