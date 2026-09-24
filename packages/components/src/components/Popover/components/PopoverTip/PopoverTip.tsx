import type { FC } from "react";

/*
 * The tip's shape — and only the shape. What positions it differs per popover
 * path: the modal one uses `Aria.OverlayArrow`, which takes the placement from
 * a context that only `Aria.Popover` puts up and that react-aria-components
 * does not export, while the non-modal one builds its wrapper from what
 * `useOverlayPosition` hands it. Both wrappers carry `.tip` from
 * `Popover.module.scss`, which styles this `<svg>` and turns it to face the
 * trigger.
 */
export const PopoverTip: FC = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
    <path d="M0 0 L8 8 L16 0" />
  </svg>
);
