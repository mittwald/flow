export { RemoteFragmentElement } from "@remote-dom/core/elements";
import { RemoteFragmentElement } from "@remote-dom/core/elements";

declare global {
  interface HTMLElementTagNameMap {
    "flr-fragment": InstanceType<typeof RemoteFragmentElement>;
  }
}

customElements.define("flr-fragment", RemoteFragmentElement);
