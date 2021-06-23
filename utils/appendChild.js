import setStyle from "./setStyle";

/**
 * Appends `element` to `parentElement`
 *
 * @param {Element} parentElement
 * @param {Element} element
 * @param {Boolean} [animate=false]
 */
export default function appendChild(context, parentElement, element, animate) {
  let parentElm;
  if (!parentElement) {
    throw new Error("parentElement is require");
  } else if (typeof parentElement === "string") {
    parentElm = context.querySelector(parentElement);
  } else {
    parentElm = parentElement;
  }
  if (animate) {
    const existingOpacity = element.style.opacity || "1";

    setStyle(element, {
      opacity: "0"
    });

    window.setTimeout(() => {
      setStyle(element, {
        opacity: existingOpacity
      });
    }, 10);
  }

  parentElm.appendChild(element);
}
