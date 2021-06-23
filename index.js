import mergeOptions from "./utils/merge-options";
import exitIntro from "./core/exit-intro.js";
import refresh from "./core/refresh";
import introForElement from "./core/introForElement";
import { cloneDeep, isEqual } from "lodash";
import {
  setGuideCurrentStep,
  clearGuideCurrentStep,
  getGuideCurrentStep
} from "./utils/current-step-utils.js";

// import { version } from '../package.json';
// import {
//   populateHints,
//   hideHint,
//   hideHints,
//   showHint,
//   showHints,
//   removeHint,
//   removeHints,
//   showHintDialog
// } from "./core/hint";
import {
  currentStep,
  goToStep,
  goToStepNumber,
  nextStep,
  previousStep
} from "./core/steps";

let cacheParams = {};

export default class VenusIntroJs {
  constructor(params) {
    const {
      stepList: introItems,
      stepName,
      context = document,
      options: optionConfig = {}
      // exitGuideFunc = () => {},
      // introCompleteCallback = () => {},
    } = params;

    // 排除 stepName 干扰项
    delete params.stepName;
    delete cacheParams.stepName;

    console.log(isEqual(params, cacheParams));
    console.log(cacheParams);
    if (isEqual(params.stepList, cacheParams.stepList)) {
      if (stepName) {
        introItems.forEach((item, idx) => {
          if (item.stepName === stepName) {
            this._currStepNum = idx;
          }
        });
      } else {
        this.currentStep = 0;
      }

      return VenusIntroJs.instance;
    } else {
      cacheParams = params;
    }

    try {
      if (!introItems || !introItems.length)
        throw new Error("introItems' length should not equal to 0");
      // if (!VenusIntroJs.instance) {
      this._introItems = introItems;
      this._context = context;
      this.version = "1.0.0";
      this._currStepNum = 0;

      console.log(introItems);

      this._options = {
        /* Next button label in tooltip box */
        nextLabel: "Next",
        /* Previous button label in tooltip box */
        prevLabel: "Back",
        /* Skip button label in tooltip box */
        skipLabel: "×",
        /* Done button label in tooltip box */
        doneLabel: "Done",
        /* Hide previous button in the first step? Otherwise, it will be disabled button. */
        hidePrev: false,
        /* Hide next button in the last step? Otherwise,
          it will be disabled button (note: this will also hide the "Done" button) */
        hideNext: false,
        /* Change the Next button to Done in the last step of the intro? otherwise, it will render a disabled button */
        nextToDone: true,
        /* Default tooltip box position */
        tooltipPosition: "bottom",
        /* Next CSS class for tooltip boxes */
        tooltipClass: "",
        /* CSS class that is added to the helperLayer */
        highlightClass: "",
        /* Close introduction when pressing Escape button? */
        exitOnEsc: true,
        /* Close introduction when clicking on overlay layer? */
        exitOnOverlayClick: true,
        /* Show step numbers in introduction? */
        showStepNumbers: false,
        /* Let user use keyboard to navigate the tour? */
        keyboardNavigation: true,
        /* Show tour control buttons? */
        showButtons: true,
        /* Show tour bullets? */
        showBullets: true,
        /* Show tour progress? */
        showProgress: false,
        /* Scroll to highlighted element? */
        scrollToElement: true,
        /*
         * Should we scroll the tooltip or target element?
         *
         * Options are: 'element' or 'tooltip'
         */
        scrollTo: "element",
        /* Padding to add after scrolling when element is not in the viewport (in pixels) */
        scrollPadding: 30,
        /* Set the overlay opacity */
        overlayOpacity: 0.5,
        /* To determine the tooltip position automatically based on the window.width/height */
        autoPosition: true,
        /* Precedence of positions, when auto is enabled */
        positionPrecedence: ["bottom", "top", "right", "left"],
        /* Disable an interaction with element? */
        disableInteraction: false,
        /* Set how much padding to be used around helper element */
        helperElementPadding: 10,
        /* Default hint position */
        hintPosition: "top-middle",
        /* Hint button label */
        hintButtonLabel: "Got it",
        /* Adding animation to hints? */
        hintAnimation: true,
        /* additional classes to put on the buttons */
        buttonClass: "venus-introjs-button",
        /* additional classes to put on progress bar */
        progressBarAdditionalClass: false
      };

      // this._introCompleteCallback = exitGuideFunc;
      VenusIntroJs.instance = this;
      // }

      // this._introItems.forEach((item, idx) => {
      if (stepName) {
        introItems.forEach((item, idx) => {
          if (item.stepName === stepName) {
            this._currStepNum = idx;
          }
        });
      } else {
        this.currentStep = 0;
      }
      console.log(stepName);
      // 配置 optionConfig【各种 label 内容、】
      this.setOptions(optionConfig);

      this.start(this._introItems);
      return VenusIntroJs.instance;
    } catch (err) {
      console.warn(err);
      exitGuideFunc();
    }
  }

  static setGuideCurrentStep(stepName) {
    setGuideCurrentStep(stepName);
  }

  static clearGuideCurrentStep() {
    clearGuideCurrentStep();
  }

  static getGuideCurrentStep() {
    return getGuideCurrentStep();
  }

  // clone a VenusIntroJs instance
  clone() {
    return new VenusIntroJs(this);
  }

  // set custom option attribute
  setOption(key, value) {
    this._options[key] = value;
    return this;
  }

  // set custom option attributes
  setOptions(options) {
    this._options = mergeOptions(this._options, options);
    return this;
  }

  // start intro
  start(group) {
    introForElement.call(this, group, this._context);
    return this;
  }

  // jump to appointed step, we accept a specific step number
  goToStep(step) {
    goToStep.call(this, step);
    return this;
  }

  // add step to current instance
  addStep(options) {
    if (!this._options.steps) {
      this._options.steps = [];
    }

    this._options.steps.push(options);

    return this;
  }
  addSteps(steps) {
    if (!steps.length) return;

    for (let index = 0; index < steps.length; index++) {
      this.addStep(steps[index]);
    }

    return this;
  }
  goToStepNumber(step) {
    goToStepNumber.call(this, step);

    return this;
  }
  nextStep() {
    nextStep.call(this);
    return this;
  }
  previousStep() {
    previousStep.call(this);
    return this;
  }
  currentStep() {
    return currentStep.call(this);
  }
  exit(force) {
    exitIntro.call(this, this._targetElement, force, this._context);
    return this;
  }
  refresh() {
    refresh.call(this);
    return this;
  }
  onbeforechange(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introBeforeChangeCallback = providedCallback;
    } else {
      throw new Error(
        "Provided callback for onbeforechange was not a function"
      );
    }
    return this;
  }
  onchange(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onchange was not a function.");
    }
    return this;
  }
  onafterchange(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introAfterChangeCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onafterchange was not a function");
    }
    return this;
  }
  oncomplete(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introCompleteCallback = providedCallback;
    } else {
      throw new Error("Provided callback for oncomplete was not a function.");
    }
    return this;
  }
  onhintsadded(providedCallback) {
    if (typeof providedCallback === "function") {
      this._hintsAddedCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintsadded was not a function.");
    }
    return this;
  }
  onhintclick(providedCallback) {
    if (typeof providedCallback === "function") {
      this._hintClickCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclick was not a function.");
    }
    return this;
  }
  onhintclose(providedCallback) {
    if (typeof providedCallback === "function") {
      this._hintCloseCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onhintclose was not a function.");
    }
    return this;
  }
  onexit(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onexit was not a function.");
    }
    return this;
  }
  onskip(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introSkipCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onskip was not a function.");
    }
    return this;
  }
  onbeforeexit(providedCallback) {
    if (typeof providedCallback === "function") {
      this._introBeforeExitCallback = providedCallback;
    } else {
      throw new Error("Provided callback for onbeforeexit was not a function.");
    }
    return this;
  }
  // addHints() {
  //   populateHints.call(this, this._targetElement, this._context);
  //   return this;
  // }
  // hideHint(stepId) {
  //   hideHint.call(this, stepId, this._context);
  //   return this;
  // }
  // hideHints() {
  //   hideHints.call(this, this._context);
  //   return this;
  // }
  // showHint(stepId) {
  //   showHint.call(this, stepId, this._context);
  //   return this;
  // }
  // showHints() {
  //   showHints.call(this, this._context);
  //   return this;
  // }
  // removeHints() {
  //   removeHints.call(this, this._context);
  //   return this;
  // }
  // removeHint(stepId) {
  //   removeHint().call(this, stepId, this._context);
  //   return this;
  // }
  // showHintDialog(stepId) {
  //   showHintDialog.call(this, stepId, this._context);
  //   return this;
  // }
}
