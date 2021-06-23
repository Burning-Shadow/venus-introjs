/* eslint-disable no-underscore-dangle */
import getScrollParent from "./getScrollParent";

/**
 * scroll a scrollable element to a child element
 *
 * @param {Object} targetElement
 */
export default function scrollParentToElement(
  targetElement,
  context = document
) {
  let { element } = targetElement;

  if (typeof element === 'string') {
    element = context.querySelector(element);
  }

  if (!this._options.scrollToElement) return;

  const parent = getScrollParent(element, context);

  if (parent === context.body) return;

  parent.scrollTop = element.offsetTop - parent.offsetTop;
}
