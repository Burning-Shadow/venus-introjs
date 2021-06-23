/* eslint-disable no-restricted-syntax */
/**
 * Overwrites target's values with source's and adds source's if non existent in target
 * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
 *
 * @param target
 * @param source
 * @returns return a new object based on target and source
 */

export default function mergeOptions(target, source) {
  return Object.assign({}, target, source);
}
