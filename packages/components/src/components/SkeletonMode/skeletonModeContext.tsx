import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from "react";

export interface SkeletonModeState {
  /** Whether components render as skeleton. */
  isEnabled: boolean;
  /** Whether an enabled `SkeletonMode` above already announces the loading. */
  isAnnounced: boolean;
}

const disabledState: SkeletonModeState = {
  isEnabled: false,
  isAnnounced: false,
};

export const skeletonModeContext =
  createContext<SkeletonModeState>(disabledState);

/** Whether the calling component renders as skeleton. */
export const useSkeletonMode = (): boolean =>
  useContext(skeletonModeContext).isEnabled;

const resetState: SkeletonModeState = {
  isEnabled: false,
  isAnnounced: true,
};

/**
 * Renders its children as real UI below a component that already draws the
 * skeleton for them — the Text inside a text bar or a button surface must not
 * draw a second bar on top.
 */
export const SkeletonModeReset: FC<PropsWithChildren> = (props) => (
  <skeletonModeContext.Provider value={resetState}>
    {props.children}
  </skeletonModeContext.Provider>
);
