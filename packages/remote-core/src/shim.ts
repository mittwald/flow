import { HTMLElement, customElements } from "@lit-labs/ssr-dom-shim";

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
