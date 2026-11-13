import { useThemeScope } from "./context";
import { themeHtmlAttribute } from "./lib/keys";

/**
 * An overlay is portalled to the end of `<body>` and leaves the `ThemeScope` it
 * was opened in. Spread on its outermost element, this takes the scope along.
 */
export const useOverlayThemeProps = () => {
  const theme = useThemeScope();
  return theme ? { [themeHtmlAttribute]: theme } : {};
};
