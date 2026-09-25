import type { FC } from "react";
import styles from "../../Popover.module.scss";

/*
 * The tip's shape — and only the shape. What positions it differs per popover
 * path: the modal one uses `Aria.OverlayArrow`, which takes the placement from
 * a context that only `Aria.Popover` puts up and that react-aria-components
 * does not export, while the non-modal one builds its wrapper from what
 * `useOverlayPosition` hands it. Both wrappers carry `.tip`; `.tipIcon` is the
 * hook `Popover.module.scss` fills, strokes and turns to face the trigger.
 */
export const PopoverTip: FC = () => (
  <svg
    className={styles.tipIcon}
    width={16}
    height={16}
    viewBox="0 0 16 16"
    aria-hidden
  >
    <path d="M0 0 L8 8 L16 0" />
  </svg>
);
