/**
 * Triggers a Value Update for an Element that also fires the React onChange
 * routine
 */
export const emitElementValueChange = (
  element: HTMLElement,
  value: string,
  event: Event = new Event("change", { bubbles: true }),
) => {
  try {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(element),
      "value",
    )?.set;
    nativeInputValueSetter?.call(element, value);
    element.dispatchEvent(event);
  } catch (ignoredError) {
    if ("value" in element) {
      element.value = value;
      element.dispatchEvent(event);
    } else {
      throw Error("could not emit value update for element");
    }
  }
};
