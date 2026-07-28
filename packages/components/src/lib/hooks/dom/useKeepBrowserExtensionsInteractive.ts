import { useEffect } from "react";

/**
 * Attribute react-aria checks to keep a node out of the `inert` / `aria-hidden`
 * isolation it applies to everything outside an open modal overlay.
 *
 * @see `isAlwaysVisibleNode` in `@react-aria/overlays` (`ariaHideOutside`)
 */
const keepInteractiveAttribute = "data-react-aria-top-layer";

const extensionUrlSchemes = [
  "chrome-extension:",
  "moz-extension:",
  "safari-web-extension:",
  "safari-extension:",
];

const isBrowserExtensionNode = (element: Element): boolean => {
  if (element.tagName.includes("-")) {
    return true;
  }
  if (element.shadowRoot !== null) {
    return true;
  }
  if (element instanceof HTMLIFrameElement) {
    const source = element.getAttribute("src") ?? "";
    return extensionUrlSchemes.some((scheme) => source.startsWith(scheme));
  }
  return false;
};

const keepInteractive = (element: Element): void => {
  if (!element.hasAttribute(keepInteractiveAttribute)) {
    element.setAttribute(keepInteractiveAttribute, "");
  }
  if (element instanceof HTMLElement && element.inert) {
    element.inert = false;
  }
  if (element.getAttribute("aria-hidden") === "true") {
    element.removeAttribute("aria-hidden");
  }
};

/**
 * While a modal overlay is open, react-aria isolates the rest of the document
 * by setting `inert` on every sibling of the modal (see `ariaHideOutside`) —
 * and it keeps doing so for nodes that appear afterwards via a
 * `MutationObserver`. That also catches UI a browser extension injects while
 * the modal is open, e.g. a password manager's autofill dropdown on a field, or
 * its "save credentials" popover. An `inert` node stays visible but cannot be
 * clicked, so the user sees the extension UI but cannot interact with it.
 *
 * This hook watches the document while `isActive` and re-enables such
 * extension-injected, document-level nodes, so browser extensions keep working
 * on top of modals. It targets the structural fingerprint of extension UI (see
 * {@link isBrowserExtensionNode}) rather than a fixed list of vendors.
 */
export const useKeepBrowserExtensionsInteractive = (
  isActive: boolean,
): void => {
  useEffect(() => {
    if (!isActive || typeof MutationObserver === "undefined") {
      return;
    }

    const root = document.body;

    const process = (node: Node): void => {
      if (node instanceof Element && isBrowserExtensionNode(node)) {
        keepInteractive(node);
      }
    };

    for (const child of Array.from(root.children)) {
      process(child);
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          process(node);
        }
      }
    });
    observer.observe(root, { childList: true });

    return () => observer.disconnect();
  }, [isActive]);
};

export default useKeepBrowserExtensionsInteractive;
