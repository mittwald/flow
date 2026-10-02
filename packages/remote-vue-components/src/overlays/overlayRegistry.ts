import type { Component, VNode } from "vue";

/**
 * The overlay components a trigger may contain.
 *
 * A trigger has to tell its trigger element (a `Button`) from the overlay it
 * opens. React does it through the props context, which names the components it
 * configures; here the components register themselves and the trigger asks.
 */
const overlayComponents = new Set<Component>();

export const markAsOverlay = <T extends Component>(component: T): T => {
  overlayComponents.add(component);
  return component;
};

export const isOverlay = (child: VNode): boolean =>
  overlayComponents.has(child.type as Component);
