/* eslint-disable no-constant-condition */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import addOverlayLayer from "./addOverlayLayer";
import cloneObject from "../utils/cloneObject";
import forEach from "../utils/forEach";
import DOMEvent from "./DOMEvent";
import { nextStep } from "./steps";
import onKeyDown from "./onKeyDown";
import onResize from "./onResize";
import createElement from "../utils/createElement";

/**
 * Initiate a new introduction/guide from an element in the page
 *
 * @api private
 * @method _introForElement
 * @param {Object} targetElm
 * @returns {Boolean} Success or not?
 */
export default function introForElement() {
  let introItems = [];

  const context = this._context;
  if (this._introItems) {
    // use steps passed programmatically
    forEach(this._introItems, step => {
      const {
        preOperator, // 当前步骤前置操作
        preStepOperator, // 点击上一步后的操作
        nextStepOperator, // 当前步骤后置操作【点击下一步后的操作】
        preExitFunc, // 退出前的回调函数
        preDom = "", // 当前步骤开始前判断标志 dom【即 dom 生成后再开始进行渲染指引，可为空】
        targetUrl = [], // 当前步骤对应 url 列【由于存在重定向故采用列表形式，可为空】
        layoutDom = "",
        stepName,
      } = step;
      const currentItem = cloneObject(step.stepConf);

      // set the step
      currentItem.stepNum = introItems.length + 1;
      currentItem.title = currentItem.title || "";

      currentItem.preOperator = preOperator;
      currentItem.preStepOperator = preStepOperator;
      currentItem.nextStepOperator = nextStepOperator;
      currentItem.preExitFunc = preExitFunc;
      currentItem.preDom = preDom;
      currentItem.targetUrl = targetUrl;
      currentItem.layoutDom = layoutDom;

      // 模型命可空
      currentItem.stepName = stepName ? stepName : `${+new Date()}_stepNum`;

      // TODO 将此部分移至渲染 / nextStep 前，

      // // use querySelector function only when developer used CSS selector
      // if (typeof currentItem.element === "string") {
      //   // grab the element with given selector from the page
      //   currentItem.element = context.querySelector(currentItem.element);
      // }

      // // intro without element
      // if (
      //   typeof currentItem.element === "undefined" ||
      //   currentItem.element === null
      // ) {
      //   let floatingElementQuery = context.querySelector(
      //     ".introjsFloatingElement"
      //   );

      //   if (floatingElementQuery === null) {
      //     floatingElementQuery = createElement("div", {
      //       className: "introjsFloatingElement"
      //     });

      //     context.body.appendChild(floatingElementQuery);
      //   }

      //   currentItem.element = floatingElementQuery;
      //   currentItem.position = "floating";
      // }

      currentItem.scrollTo = currentItem.scrollTo || this._options.scrollTo;

      if (typeof currentItem.disableInteraction === "undefined") {
        currentItem.disableInteraction = this._options.disableInteraction;
      }

      if (currentItem.element !== null) {
        introItems.push(currentItem);
      }
    });
  }

  // removing undefined/null elements
  const tempIntroItems = introItems.filter(_ => _);
  introItems = tempIntroItems;

  // Ok, sort all items with given steps
  introItems.sort((a, b) => a.step - b.step);

  // set it to the introJs object
  this._introItems = introItems;

  const { targetElement } = introItems[0];
  let targetElm;
  if (typeof targetElement === "object") {
    targetElm = targetElement;
  } else if (typeof targetElement === "string") {
    targetElm = context.querySelector(targetElement);
    if (!targetElm) {
      console.error("There is no element with given selector.");
      return;
    }
  } else {
    targetElm = context.body;
  }


  // add overlay layer to the page
  if (addOverlayLayer.call(this, targetElm, context)) {
    // then, start the show
    nextStep.call(this);

    if (this._options.keyboardNavigation) {
      DOMEvent.on(window, "keydown", onKeyDown, this, true);
    }
    // for window resize
    DOMEvent.on(window, "resize", onResize, this, true);
  }
  return false;
}
