/* eslint-disable no-underscore-dangle */
import exitIntro from "./exit-intro.js";
import createElement from "../utils/createElement";
import setStyle from "../utils/setStyle";

/**
 * Add overlay layer to the page
 *
 * @api private
 * @method _addOverlayLayer
 * @param {Object|String} targetElm
 */
export default function addOverlayLayer(targetElm) {
  let targetElement;
  if (!targetElm) {
    throw new Error("targetElm is required");
  } else if (typeof targetElm === "string") {
    targetElement = this._context.querySelector(targetElement);
  }

  const overlayLayer = createElement("div", {
    className: "venus-introjs-overlay"
  });

  setStyle(overlayLayer, {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "fixed"
  });

  targetElm.appendChild(overlayLayer);

  if (this._options.exitOnOverlayClick === true) {
    setStyle(overlayLayer, {
      cursor: "pointer"
    });

    overlayLayer.onclick = () => {
      exitIntro.call(this, targetElement);
    };
  }

  return true;
}
