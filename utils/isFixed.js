import getPropValue from "./getPropValue";

/**
 * Checks to see if target element (or parents) position is fixed or not
 *
 * @api private
 * @method _isFixed
 * @param {Object} element
 * @returns Boolean
 */
export default function isFixed(element, context) {
  const p = element.parentNode;

  if (!p || p.nodeName === "HTML") {
    return false;
  }

  if (getPropValue(element, "position", context) === "fixed") {
    return true;
  }

  return isFixed(p, context);
}
