/* eslint-disable no-mixed-operators */
/* eslint-disable no-underscore-dangle */
import getOffset from "../utils/getOffset";
import isFixed from "../utils/isFixed";
import addClass from "../utils/addClass";
import removeClass from "../utils/removeClass";
import setStyle from "../utils/setStyle";

/**
 * Update the position of the helper layer on the screen
 *
 * @api private
 * @method _setHelperLayerPosition
 * @param {Object} helperLayer
 */
export default function setHelperLayerPosition(helperLayer) {
  if (helperLayer) {
    // prevent error when `this._currStepNum` in undefined
    if (!this._introItems[this._currStepNum - 1]) return;

    const currentElement = this._introItems[this._currStepNum - 1];
    const elementPosition = getOffset(
      this._context,
      currentElement.element,
      this._targetElement
    );
    let widthHeightPadding = this._options.helperElementPadding;

    // If the target element is fixed, the tooltip should be fixed as well.
    // Otherwise, remove a fixed class that may be left over from the previous
    // step.
    if (isFixed(currentElement.element, this._context)) {
      addClass(helperLayer, "venus-introjs-fixedTooltip");
    } else {
      removeClass(helperLayer, "venus-introjs-fixedTooltip");
    }

    if (currentElement.position === "floating") {
      widthHeightPadding = 0;
    }

    // set new position to helper layer
    setStyle(helperLayer, {
      width: `${elementPosition.width + widthHeightPadding}px`,
      height: `${elementPosition.height + widthHeightPadding}px`,
      top: `${elementPosition.top - widthHeightPadding / 2}px`,
      left: `${elementPosition.left - widthHeightPadding / 2}px`
    });
  }
}
