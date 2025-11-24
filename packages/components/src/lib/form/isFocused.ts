export const isFocused = (element: HTMLElement | null) => {
  return element?.getAttribute("data-focused") === "true";
};
