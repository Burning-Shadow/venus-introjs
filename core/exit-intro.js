/* eslint-disable no-underscore-dangle */
import forEach from "../utils/forEach";
import DOMEvent from "./DOMEvent";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import removeShowElement from "./removeShowElement";
import removeChild from "../utils/removeChild";
import { clearGuideCurrentStep } from "../utils/current-step-utils.js";

/**
 * Exit from intro
 *
 * @api private
 * @method _exitIntro
 * @param {Object} targetElement
 * @param {Boolean} force - Setting to `true` will skip the result of beforeExit callback
 */
export default function exitIntro(targetElement, force) {
  const context = this._context;
  let continueExit = true;

  // calling onbeforeexit callback
  //
  // If this callback return `false`, it would halt the process
  if (this._introBeforeExitCallback !== undefined) {
    continueExit = this._introBeforeExitCallback.call(this);
  }

  // skip this check if `force` parameter is `true`
  // otherwise, if `onbeforeexit` returned `false`, don't exit the intro
  if (!force && continueExit === false) return;

  // remove overlay layers from the page
  const overlayLayers = context.querySelectorAll(".venus-introjs-overlay");

  if (overlayLayers && overlayLayers.length) {
    forEach(overlayLayers, overlayLayer => removeChild(overlayLayer));
  }

  // remove all helper layers
  const helperLayer = context.querySelector(".venus-introjs-helperLayer");
  removeChild(helperLayer, true);

  const referenceLayer = context.querySelector(
    ".venus-introjs-tooltipReferenceLayer"
  );
  removeChild(referenceLayer);

  // remove disableInteractionLayer
  const disableInteractionLayer = context.querySelector(
    ".venus-introjs-disableInteraction"
  );
  removeChild(disableInteractionLayer);

  // remove intro floating element
  const floatingElement = context.querySelector(".introjsFloatingElement");
  removeChild(floatingElement);

  removeShowElement(context);

  // clean listeners
  DOMEvent.off(window, "keydown", onKeyDown, this, true);
  DOMEvent.off(window, "resize", onResize, this, true);

  // check if any callback is defined
  if (this._introExitCallback !== undefined) {
    this._introExitCallback.call(this);
  }

  // set the step to zero
  this._currStepNum = undefined;

  clearGuideCurrentStep();
}
