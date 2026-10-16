import type { Action } from "svelte/action";

/**
 * Names the slot a wrapper element fills.
 *
 * Set as an **attribute**, deliberately: `slot` reaches the remote tree through
 * `attributeChangedCallback`, so a property assignment — which is what a
 * framework's own custom-element handling tends to prefer — never arrives at
 * the host.
 */
export const slotAttribute: Action<Element, string> = (node, name) => {
  node.setAttribute("slot", name);

  return {
    update: (next: string) => node.setAttribute("slot", next),
  };
};
