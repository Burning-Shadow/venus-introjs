import forEach from "../utils/forEach";
import removeClass from "../utils/removeClass";

/**
 * To remove all show element(s)
 *
 * @api private
 * @method _removeShowElement
 */
export default function removeShowElement(context) {
  const elms = context.querySelectorAll(".venus-introjs-showElement");

  forEach(elms, elm => {
    removeClass(elm, /venus-introjs-[a-zA-Z]+/g);
  });
}
