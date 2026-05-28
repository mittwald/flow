export const getBodyInnerWidth = () => {
  if (typeof window === "undefined") {
    return 0;
  }
  const bodyStyles = window.getComputedStyle(document.body);
  return (
    document.documentElement.clientWidth -
    parseFloat(bodyStyles.paddingLeft) -
    parseFloat(bodyStyles.paddingRight)
  );
};
