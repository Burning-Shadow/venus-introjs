/* eslint-disable no-underscore-dangle */
import setShowElement from "../utils/setShowElement";
import scrollParentToElement from "../utils/scrollParentToElement";
import addClass from "../utils/addClass";
import scrollTo from "../utils/scrollTo";
import exitIntro from "./exit-intro.js";
import forEach from "../utils/forEach";
import setAnchorAsButton from "../utils/setAnchorAsButton";
import { nextStep, previousStep } from "./steps";
import setHelperLayerPosition from "./setHelperLayerPosition";
import placeTooltip from "./placeTooltip";
import removeShowElement from "./removeShowElement";
import createElement from "../utils/createElement";
import setStyle from "../utils/setStyle";
import appendChild from "../utils/appendChild";

/**
 * Gets the current progress percentage
 *
 * @api private
 * @method _getProgress
 * @returns current progress percentage
 */
function _getProgress() {
  // Steps are 0 indexed
  const currentStep = parseInt(this._currStepNum + 1, 10);
  return (currentStep / this._introItems.length) * 100;
}

/**
 * Add disableinteraction layer and adjust the size and position of the layer
 *
 * @api private
 * @method _disableInteraction
 */
function _disableInteraction(context = document) {
  let disableInteractionLayer = context.querySelector(
    ".venus-introjs-disableInteraction"
  );

  if (disableInteractionLayer === null) {
    disableInteractionLayer = createElement(
      "div",
      {
        className: "venus-introjs-disableInteraction"
      },
      context
    );

    this._targetElement.appendChild(disableInteractionLayer);
  }

  setHelperLayerPosition.call(this, disableInteractionLayer);
}

/**
 * Show an element on the page
 *
 * @api private
 * @method _showElement
 * @param {Object} targetElement
 */
export default function _showElement(currentElement, targetElement) {
  const context = this._context;
  if (
    typeof targetElement.element === "undefined" ||
    targetElement.element === null
  ) {
    let floatingElementQuery = context.querySelector(".introjsFloatingElement");

    if (floatingElementQuery === null) {
      floatingElementQuery = createElement(
        "div",
        {
          className: "introjsFloatingElement"
        },
        context
      );

      context.body.appendChild(floatingElementQuery);
    }

    targetElement.element = floatingElementQuery;
    targetElement.position = "floating";
  }
  // use querySelector function only when developer used CSS selector
  else if (typeof targetElement.element === "string") {
    targetElement.element = context.querySelector(targetElement.element);
  }

  this._targetElement = context.querySelector(targetElement.layoutDom);

  if (typeof this._introChangeCallback !== "undefined") {
    this._introChangeCallback.call(this, targetElement.element);
  }

  const self = this;
  const oldHelperLayer = context.querySelector(".venus-introjs-helperLayer");
  const oldReferenceLayer = context.querySelector(
    ".venus-introjs-tooltipReferenceLayer"
  );
  let highlightClass = "venus-introjs-helperLayer";
  let nextTooltipButton;
  let prevTooltipButton;
  let skipTooltipButton;

  // check for a current step highlight class
  if (typeof targetElement.highlightClass === "string") {
    highlightClass += ` ${targetElement.highlightClass}`;
  }
  // check for options highlight class
  if (typeof this._options.highlightClass === "string") {
    highlightClass += ` ${this._options.highlightClass}`;
  }

  if (oldHelperLayer !== null) {
    const oldHelperNumberLayer = oldReferenceLayer.querySelector(
      ".venus-introjs-helperNumberLayer"
    );
    const oldtooltipLayer = oldReferenceLayer.querySelector(
      ".venus-introjs-tooltiptext"
    );
    const oldTooltipTitleLayer = oldReferenceLayer.querySelector(
      ".venus-introjs-tooltip-title"
    );
    const oldArrowLayer = oldReferenceLayer.querySelector(
      ".venus-introjs-arrow"
    );
    const oldtooltipContainer = oldReferenceLayer.querySelector(
      ".venus-introjs-tooltip"
    );

    skipTooltipButton = oldReferenceLayer.querySelector(
      ".venus-introjs-skipbutton"
    );
    prevTooltipButton = oldReferenceLayer.querySelector(
      ".venus-introjs-prevbutton"
    );
    nextTooltipButton = oldReferenceLayer.querySelector(
      ".venus-introjs-nextbutton"
    );

    // update or reset the helper highlight class
    oldHelperLayer.className = highlightClass;
    // hide the tooltip
    oldtooltipContainer.style.opacity = 0;
    oldtooltipContainer.style.display = "none";

    // if the target element is within a scrollable element
    scrollParentToElement.call(self, targetElement, context);

    // set new position to helper layer
    setHelperLayerPosition.call(self, oldHelperLayer);
    setHelperLayerPosition.call(self, oldReferenceLayer);

    // remove old classes if the element still exist
    removeShowElement(context);

    /* we should wait until the CSS3 transition is competed (it's 0.3 sec)
    to prevent incorrect `height` and `width` calculation */
    if (self._lastShowElementTimer) {
      window.clearTimeout(self._lastShowElementTimer);
    }

    self._lastShowElementTimer = window.setTimeout(() => {
      // set current step to the label
      if (oldHelperNumberLayer !== null) {
        oldHelperNumberLayer.innerHTML = `${targetElement.step} of ${this._introItems.length}`;
      }

      // set current tooltip text
      oldtooltipLayer.innerHTML = targetElement.intro;

      // set current tooltip title
      oldTooltipTitleLayer.innerHTML = targetElement.title;

      // set the tooltip position
      oldtooltipContainer.style.display = "block";
      placeTooltip.call(
        self,
        targetElement.element,
        oldtooltipContainer,
        oldArrowLayer,
        oldHelperNumberLayer
      );

      // change active bullet
      if (self._options.showBullets) {
        oldReferenceLayer.querySelector(
          ".venus-introjs-bullets li > a.active"
        ).className = "";
        oldReferenceLayer.querySelector(
          `.venus-introjs-bullets li > a[data-stepnumber="${targetElement.step}"]`
        ).className = "active";
      }
      oldReferenceLayer.querySelector(
        ".venus-introjs-progress .venus-introjs-progressbar"
      ).style.cssText = `width:${_getProgress.call(self)}%;`;
      oldReferenceLayer
        .querySelector(".venus-introjs-progress .venus-introjs-progressbar")
        .setAttribute("aria-valuenow", _getProgress.call(self));

      // show the tooltip
      oldtooltipContainer.style.opacity = 1;

      // reset button focus
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null &&
        /venus-introjs-donebutton/gi.test(nextTooltipButton.className)
      ) {
        // skip button is now "done" button
        nextTooltipButton.focus();
      } else if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        // still in the tour, focus on next
        nextTooltipButton.focus();
      }

      // change the scroll of the window, if needed
      scrollTo.call(
        self,
        targetElement.scrollTo,
        targetElement,
        oldtooltipLayer
      );
    }, 350);

    // end of old element if-else condition
  } else {
    const helperLayer = createElement(
      "div",
      {
        className: highlightClass
      },
      context
    );
    const referenceLayer = createElement(
      "div",
      {
        className: "venus-introjs-tooltipReferenceLayer"
      },
      context
    );
    const arrowLayer = createElement(
      "div",
      {
        className: "venus-introjs-arrow"
      },
      context
    );
    const tooltipLayer = createElement(
      "div",
      {
        className: "venus-introjs-tooltip"
      },
      context
    );
    const tooltipTextLayer = createElement(
      "div",
      {
        className: "venus-introjs-tooltiptext"
      },
      context
    );
    const tooltipHeaderLayer = createElement(
      "div",
      {
        className: "venus-introjs-tooltip-header"
      },
      context
    );
    const tooltipTitleLayer = createElement(
      "h1",
      {
        className: "venus-introjs-tooltip-title"
      },
      context
    );
    const bulletsLayer = createElement(
      "div",
      {
        className: "venus-introjs-bullets"
      },
      context
    );
    const progressLayer = context.createElement("div");
    const buttonsLayer = context.createElement("div");

    console.log(self._options.overlayOpacity.toString());
    setStyle(helperLayer, {
      "box-shadow": `0 0 1px 1px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ${self._options.overlayOpacity.toString()}) 0 0 0 5000px`
    });

    // target is within a scrollable element
    scrollParentToElement.call(self, targetElement, context);

    // set new position to helper layer
    setHelperLayerPosition.call(self, helperLayer);
    setHelperLayerPosition.call(self, referenceLayer);

    // add helper layer to target element
    appendChild(this._context, this._targetElement, helperLayer, true);
    appendChild(this._context, this._targetElement, referenceLayer);

    tooltipTextLayer.innerHTML = targetElement.intro;
    tooltipTitleLayer.innerHTML = targetElement.title;

    if (this._options.showBullets === false) {
      bulletsLayer.style.display = "none";
    }

    const ulContainer = context.createElement("ul");
    ulContainer.setAttribute("role", "tablist");

    const anchorClick = function() {
      self.goToStep(this.getAttribute("data-stepnumber"));
    };

    forEach(this._introItems, ({ step }, i) => {
      const innerLi = context.createElement("li");
      const anchorLink = context.createElement("a");

      innerLi.setAttribute("role", "presentation");
      anchorLink.setAttribute("role", "tab");

      anchorLink.onclick = anchorClick;

      if (i === targetElement.step - 1) {
        anchorLink.className = "active";
      }

      setAnchorAsButton(anchorLink);
      anchorLink.innerHTML = "&nbsp;";
      anchorLink.setAttribute("data-stepnumber", step);

      innerLi.appendChild(anchorLink);
      ulContainer.appendChild(innerLi);
    });

    bulletsLayer.appendChild(ulContainer);

    progressLayer.className = "venus-introjs-progress";

    if (this._options.showProgress === false) {
      progressLayer.style.display = "none";
    }

    const progressBar = createElement(
      "div",
      {
        className: "venus-introjs-progressbar"
      },
      context
    );

    if (this._options.progressBarAdditionalClass) {
      progressBar.className += ` ${this._options.progressBarAdditionalClass}`;
    }
    progressBar.setAttribute("role", "progress");
    progressBar.setAttribute("aria-valuemin", 0);
    progressBar.setAttribute("aria-valuemax", 100);
    progressBar.setAttribute("aria-valuenow", _getProgress.call(this));
    progressBar.style.cssText = `width:${_getProgress.call(this)}%;`;

    progressLayer.appendChild(progressBar);

    buttonsLayer.className = "venus-introjs-tooltipbuttons";
    // if (this._options.showButtons === false) {
    //   buttonsLayer.style.display = "none";
    // }

    tooltipHeaderLayer.appendChild(tooltipTitleLayer);
    tooltipLayer.appendChild(tooltipHeaderLayer);
    tooltipLayer.appendChild(tooltipTextLayer);
    tooltipLayer.appendChild(bulletsLayer);
    tooltipLayer.appendChild(progressLayer);

    // add helper layer number
    const helperNumberLayer = context.createElement("div");

    if (this._options.showStepNumbers === true) {
      helperNumberLayer.className = "venus-introjs-helperNumberLayer";
      helperNumberLayer.innerHTML = `${targetElement.step} of ${this._introItems.length}`;
      tooltipLayer.appendChild(helperNumberLayer);
    }

    tooltipLayer.appendChild(arrowLayer);
    referenceLayer.appendChild(tooltipLayer);

    // next button
    nextTooltipButton = context.createElement("a");

    nextTooltipButton.onclick = () => {
      if (self._introItems.length !== self._currStepNum) {
        nextStep.call(self);
      } else if (
        /venus-introjs-donebutton/gi.test(nextTooltipButton.className)
      ) {
        if (typeof self._introCompleteCallback === "function") {
          self._introCompleteCallback.call(self);
        }

        exitIntro.call(self, self._targetElement, self._context);
      }
    };

    setAnchorAsButton(nextTooltipButton);
    nextTooltipButton.innerHTML = this._options.nextLabel;

    // previous button
    prevTooltipButton = context.createElement("a");

    prevTooltipButton.onclick = () => {
      if (self._currStepNum !== 0) {
        previousStep.call(self);
      }
    };

    setAnchorAsButton(prevTooltipButton);
    prevTooltipButton.innerHTML = this._options.prevLabel;

    // skip button
    skipTooltipButton = createElement(
      "a",
      {
        className: "venus-introjs-skipbutton"
      },
      context
    );

    setAnchorAsButton(skipTooltipButton);
    skipTooltipButton.innerHTML = this._options.skipLabel;

    skipTooltipButton.onclick = () => {
      const { preExitFunc } =
        self && self._introItems && self._introItems[self._currStepNum - 1];
      if (typeof preExitFunc === "function") {
        preExitFunc();
      }

      // if (typeof self._introSkipCallback === "function") {
      //   self._introSkipCallback.call(self);
      // }

      exitIntro.call(self, self._targetElement, self._context);
    };

    tooltipHeaderLayer.appendChild(skipTooltipButton);

    // in order to prevent displaying previous button always
    if (this._introItems.length > 1) {
      buttonsLayer.appendChild(prevTooltipButton);
    }

    // we always need the next button because this
    // button changes to "Done" in the last step of the tour
    buttonsLayer.appendChild(nextTooltipButton);
    tooltipLayer.appendChild(buttonsLayer);

    // set proper position
    placeTooltip.call(
      self,
      targetElement.element,
      tooltipLayer,
      arrowLayer,
      helperNumberLayer
    );

    // change the scroll of the window, if needed
    scrollTo.call(this, targetElement.scrollTo, targetElement, tooltipLayer);

    // end of new element if-else condition
  }

  // removing previous disable interaction layer
  const disableInteractionLayer = self._targetElement.querySelector(
    ".venus-introjs-disableInteraction"
  );
  if (disableInteractionLayer) {
    disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
  }

  // disable interaction
  if (targetElement.disableInteraction) {
    _disableInteraction.call(self, self._context);
  }

  // when it's the first step of tour
  if (this._currStepNum === 0 && this._introItems.length > 1) {
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${this._options.buttonClass} venus-introjs-nextbutton`;
      nextTooltipButton.innerHTML = this._options.nextLabel;
    }

    if (this._options.hidePrev === true) {
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        prevTooltipButton.className = `${this._options.buttonClass} venus-introjs-prevbutton venus-introjs-hidden`;
      }
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        addClass(nextTooltipButton, "venus-introjs-fullbutton");
      }
    } else {
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        prevTooltipButton.className = `${this._options.buttonClass} venus-introjs-prevbutton venus-introjs-disabled`;
      }
    }
  } else if (
    this._introItems.length - 1 === this._currStepNum ||
    this._introItems.length === 1
  ) {
    // last step of tour
    if (
      typeof prevTooltipButton !== "undefined" &&
      prevTooltipButton !== null
    ) {
      prevTooltipButton.className = `${this._options.buttonClass} venus-introjs-prevbutton`;
    }

    if (this._options.hideNext === true) {
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        nextTooltipButton.className = `${this._options.buttonClass} venus-introjs-nextbutton venus-introjs-hidden`;
      }
      if (
        typeof prevTooltipButton !== "undefined" &&
        prevTooltipButton !== null
      ) {
        addClass(prevTooltipButton, "venus-introjs-fullbutton");
      }
    } else {
      if (
        typeof nextTooltipButton !== "undefined" &&
        nextTooltipButton !== null
      ) {
        if (this._options.nextToDone === true) {
          nextTooltipButton.innerHTML = this._options.doneLabel;
          addClass(
            nextTooltipButton,
            `${this._options.buttonClass} venus-introjs-nextbutton venus-introjs-donebutton`
          );
        } else {
          nextTooltipButton.className = `${this._options.buttonClass} venus-introjs-nextbutton venus-introjs-disabled`;
        }
      }
    }
  } else {
    // steps between start and end
    if (
      typeof prevTooltipButton !== "undefined" &&
      prevTooltipButton !== null
    ) {
      prevTooltipButton.className = `${this._options.buttonClass} venus-introjs-prevbutton`;
    }
    if (
      typeof nextTooltipButton !== "undefined" &&
      nextTooltipButton !== null
    ) {
      nextTooltipButton.className = `${this._options.buttonClass} venus-introjs-nextbutton`;
      nextTooltipButton.innerHTML = this._options.nextLabel;
    }
  }

  if (typeof prevTooltipButton !== "undefined" && prevTooltipButton !== null) {
    prevTooltipButton.setAttribute("role", "button");
  }
  if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
    nextTooltipButton.setAttribute("role", "button");
  }
  if (typeof skipTooltipButton !== "undefined" && skipTooltipButton !== null) {
    skipTooltipButton.setAttribute("role", "button");
  }

  // Set focus on "next" button, so that hitting Enter always moves you onto the next step
  if (typeof nextTooltipButton !== "undefined" && nextTooltipButton !== null) {
    nextTooltipButton.focus();
  }

  setShowElement(targetElement, context);

  if (typeof this._introAfterChangeCallback !== "undefined") {
    this._introAfterChangeCallback.call(this, targetElement.element);
  }
}
