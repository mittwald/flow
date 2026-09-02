import { HTMLElement, customElements } from "@lit-labs/ssr-dom-shim";

/**
 * Installs a minimal DOM shim so modules that subclass `HTMLElement` — the
 * remote custom elements, via the remote-dom fork's `RemoteElement` — can be
 * evaluated in a Node/SSR context (e.g. Next.js server-rendering a client
 * component). Guarded on a missing DOM, so it is a no-op in a real browser and
 * can safely live on the browser entry without clobbering the native DOM.
 *
 * Exported as a _used binding_ rather than imported as a bare `import
 * "./shim"`: Vite 8's Rollup reorders bare side-effect imports after binding
 * imports, which would let `HTMLElement` be subclassed before the shim runs. A
 * binding keeps this import in source order — first.
 */
export const domShimApplied = (() => {
  if (typeof globalThis.HTMLElement === "undefined") {
    globalThis.HTMLElement = HTMLElement;
    globalThis.customElements = customElements;
    globalThis.MutationObserver = class MutationObserver {
      public constructor() {
        // mocked
      }
      public disconnect() {
        // mocked
      }
      public observe() {
        // mocked
      }
      public takeRecords() {
        return [];
      }
    };
  }

  return true;
})();
