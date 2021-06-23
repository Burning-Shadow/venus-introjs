/* eslint-disable no-underscore-dangle */
import showElement from "./showElement";
import exitIntro from "./exit-intro.js";
import cloneObject from "../utils/cloneObject";
import createElement from "../utils/createElement";
import { setGuideCurrentStep } from "../utils/current-step-utils.js";

/**
 * Go to specific step of introduction
 *
 * @api private
 * @method _goToStep
 */
export function goToStep(step) {
  // because steps starts with zero
  this._currStepNum = step - 2;
  if (typeof this._introItems !== "undefined") {
    nextStep.call(this);
  }
}

/**
 * Go to the specific step of introduction with the explicit [data-step] number
 *
 * @api private
 * @method _goToStepNumber
 */
export function goToStepNumber(step) {
  this._currStepNum = step;
  if (typeof this._introItems !== "undefined") {
    nextStep.call(this);
  }
}

/**
 * Go to next step on intro
 *
 * @api private
 * @method _nextStep
 */
export async function nextStep() {
  this._direction = "forward";

  // 执行该步骤前置操作
  if (typeof this._currStepNum === "undefined") {
    this._currStepNum = 0;
  } else {
    this._currStepNum += 1;
  }

  const currStep = this._introItems[this._currStepNum - 2];
  const nextStep = this._introItems[this._currStepNum - 1];
  let continueStep = true;

  if (
    currStep &&
    currStep.nextStepOperator &&
    typeof currStep.nextStepOperator === "function"
  ) {
    await currStep.nextStepOperator();
  }

  if (typeof this._introBeforeChangeCallback !== "undefined") {
    continueStep = this._introBeforeChangeCallback.call(
      this,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    this._currStepNum -= 1;
    return false;
  }

  setGuideCurrentStep(nextStep.stepName);

  if (nextStep.preOperator && typeof nextStep.preOperator === "function") {
    await nextStep.preOperator();
  }

  if (this._introItems.length <= this._currStepNum) {
    // end of the intro
    // check if any callback is defined
    if (typeof this._introCompleteCallback === "function") {
      this._introCompleteCallback.call(this);
    }
    exitIntro.call(this, this._targetElement);
    return;
  }

  showElement.call(this, currStep, nextStep);

  return;
}

/**
 * Go to previous step on intro
 *
 * @api private
 * @method _previousStep
 */
export async function previousStep() {
  this._direction = "backward";

  if (this._currStepNum === 0) {
    return false;
  }

  this._currStepNum -= 1;

  const currStep = this._introItems[this._currStepNum];
  const nextStep = this._introItems[this._currStepNum - 1];
  let continueStep = true;

  if (typeof this._introBeforeChangeCallback !== "undefined") {
    continueStep = this._introBeforeChangeCallback.call(
      this,
      nextStep && nextStep.element
    );
  }

  // if `onbeforechange` returned `false`, stop displaying the element
  if (continueStep === false) {
    this._currStepNum += 1;
    return false;
  }

  if (
    currStep &&
    currStep.preStepOperator &&
    typeof currStep.preStepOperator === "function"
  ) {
    await currStep.preStepOperator();
  }

  showElement.call(this, currStep, nextStep);
  setGuideCurrentStep(nextStep.stepName);
  return;
}

/**
 * Returns the current step of the intro
 *
 * @returns {number | boolean}
 */
export function currentStep() {
  return this._currStepNum;
}
