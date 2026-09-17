import { createContext } from "react";

/**
 * How a popover relates to the rest of the page.
 *
 * - `"modal"` – the page below is locked: scrolling is blocked, everything
 *   outside the popover is `inert`, and focus moves into the popover, which is
 *   a `dialog`.
 * - `"non-modal"` – the page stays scrollable and interactive. The popover
 *   carries no dialog semantics: no role, no label, no focus. Its content is
 *   plain content, and it is rendered where it stands rather than portalled to
 *   the end of the body, so it keeps its place in the reading order.
 */
export type PopoverModality = "modal" | "non-modal";

/**
 * Which of the two a popover in this subtree is. Deliberately not a prop on
 * `Popover`: the non-modal popover is not a variant a consumer picks, it is the
 * shape one component needs. `CoachMark` sets it, `PopoverContent` reads it,
 * and nothing else has to know it exists.
 */
export const PopoverModalityContext = createContext<PopoverModality>("modal");
