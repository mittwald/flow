import type { PropsContext } from "@/lib/propsContext/types";
import type { PropsWithTunnel } from "@/lib/types/props";

/**
 * Props context entries that send every overlay trigger into `tunnel`.
 *
 * A props context that tunnels `Button` has to tunnel the overlay triggers as a
 * whole, not their buttons: `OverlayTrigger` pins its trigger button in place
 * (`tunnel: null`), because react-aria wires the press handling, the trigger
 * ref and `aria-haspopup`/`aria-expanded`/`aria-controls` through a
 * `PressResponder` that only reaches its own subtree. Tunnelling the button
 * alone lifts it out of that subtree and silently drops all of it.
 *
 * Spread the entries before the context's own, so a single trigger can still be
 * sent somewhere else (see `Label`).
 */
export const overlayTriggersTunneledTo = (
  tunnel: PropsWithTunnel["tunnel"],
): PropsContext => ({
  ContextMenuTrigger: { tunnel },
  ContextualHelpTrigger: { tunnel },
  ModalTrigger: { tunnel },
  PopoverTrigger: { tunnel },
});

export default overlayTriggersTunneledTo;
