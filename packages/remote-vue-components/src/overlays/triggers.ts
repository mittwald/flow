import { composition } from "@/lib/composition";
import { createOverlayTrigger } from "@/overlays/createOverlayTrigger";

/** Opens a `Modal`. */
export const ModalTrigger = composition(
  createOverlayTrigger("ModalTrigger", "Modal", { reportsUsage: true }),
);

/** Opens a `Popover`. */
export const PopoverTrigger = composition(
  createOverlayTrigger("PopoverTrigger", "Popover", { reportsUsage: true }),
);

/** Opens a `LightBox`. */
export const LightBoxTrigger = composition(
  createOverlayTrigger("LightBoxTrigger", "LightBox", { reportsUsage: false }),
);
