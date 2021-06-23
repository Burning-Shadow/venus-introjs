/* eslint-disable no-underscore-dangle */
import { reAlignHints } from "./hint";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";

/**
 * Update placement of the intro objects on the screen
 * @api private
 */
export default function refresh() {
  const context = this._context;
  // re-align intros
  setHelperLayerPosition.call(
    this,
    context.querySelector(".venus-introjs-helperLayer")
  );
  setHelperLayerPosition.call(
    this,
    context.querySelector(".venus-introjs-tooltipReferenceLayer")
  );
  setHelperLayerPosition.call(
    this,
    context.querySelector(".venus-introjs-disableInteraction")
  );

  // re-align tooltip
  if (this._currStepNum !== undefined && this._currStepNum !== null) {
    const oldArrowLayer = context.querySelector(".venus-introjs-arrow");
    const oldtooltipContainer = context.querySelector(".venus-introjs-tooltip");

    placeTooltip.call(
      this,
      this._context,
      this._introItems[this._currStepNum].element,
      oldtooltipContainer,
      oldArrowLayer
    );
  }

  // re-align hints
  reAlignHints.call(this);
  return this;
}
