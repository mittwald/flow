import { type FC, type PropsWithChildren, useContext } from "react";
import * as Aria from "react-aria-components";
import { useLocalizedStringFormatter } from "@/components/TranslationProvider";
import locales from "./locales/*.locale.json";
import {
  skeletonModeContext,
  type SkeletonModeState,
} from "./skeletonModeContext";

export interface SkeletonModeProps extends PropsWithChildren {
  /**
   * Whether the components inside render as skeleton. A nested `SkeletonMode`
   * with `isEnabled={false}` renders its content as real UI.
   *
   * @default true
   */
  isEnabled?: boolean;
}

/**
 * @flr-generate all
 * @flowStatus beta, new
 */
export const SkeletonMode: FC<SkeletonModeProps> = (props) => {
  const { children, isEnabled = true } = props;

  const parent = useContext(skeletonModeContext);
  const stringFormatter = useLocalizedStringFormatter(locales, "SkeletonMode");

  const announces = isEnabled && !parent.isAnnounced;

  const state: SkeletonModeState = {
    isEnabled,
    isAnnounced: parent.isAnnounced || isEnabled,
  };

  const announcement = announces && (
    <Aria.VisuallyHidden role="status">
      {stringFormatter.format("loading")}
    </Aria.VisuallyHidden>
  );

  return (
    <skeletonModeContext.Provider value={state}>
      {announcement}
      {children}
    </skeletonModeContext.Provider>
  );
};

export default SkeletonMode;
