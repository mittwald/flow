/**
 * Triggers a Value Update for an Element that also fires the React onChange
 * routine
 *
 * @param element
 * @param value
 * @param event
 */
export const emitElementValueChange = (
  element: HTMLElement,
  value: string,
  event: Event = new Event("change", { bubbles: true }),
) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(element),
    "value",
  )?.set;
  nativeInputValueSetter?.call(element, value);
  element.dispatchEvent(event);
};
