import { createContext, useContext } from "react";

const activityContext = createContext(true);

/**
 * Whether the surrounding `Activity` is active.
 *
 * A deactivated `Activity` hides its subtree by suspending it (or by React's
 * own `Activity`). Either way React stops committing that subtree's renders, so
 * everything it portalled out of its own DOM — an open popover, a modal — stays
 * on screen, frozen. Content that renders outside the subtree must therefore
 * unmount itself while this is `false`.
 */
export const useIsActivityActive = (): boolean => useContext(activityContext);

export const ActivityContextProvider = activityContext.Provider;
