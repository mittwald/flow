import { type FC } from "react";
import { themeStorageKey } from "../../_lib/themeStorage";

export const ThemeInitializerScript: FC = () => {
  const scriptContent = `\
/**
 * This Script can not use dependencies, because dependencies can not be
 * inlined.
 */
function initialize() {
  const htmlAttribute = "data-flow-theme";
  const storageKey = "${themeStorageKey}";

    function getLocalStorageValue() {
    return localStorage.getItem(storageKey) ?? "system";
  }

  function getHtmlAttribute() {
    return document.documentElement.getAttribute(htmlAttribute);
  }

  function setTheme() {
    const currentValue = getHtmlAttribute();
    const localStorageValue = getLocalStorageValue();
    if (currentValue !== localStorageValue) {
      document.documentElement.setAttribute(htmlAttribute, localStorageValue);
    }
  }

  /** Monitor */
  const mutationObserver = new MutationObserver((changes) => {
    for (const change of changes) {
      if (
        change.type === "attributes" &&
        change.attributeName === htmlAttribute &&
        change.target instanceof HTMLHtmlElement &&
        !change.target.getAttribute(htmlAttribute)
      ) {
        setTheme();
      }
    }
  });

  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [htmlAttribute],
  });

  setTheme();
}

initialize();
  `;

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />;
};
