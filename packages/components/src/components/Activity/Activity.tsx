import SuspenseTrigger from "@/components/SuspenseTrigger";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { type FC, type PropsWithChildren } from "react";
import { Suspense } from "react";
import { useIsSSR } from "react-aria";
import {
  ActivityContextProvider,
  useIsActivityActive,
} from "@/components/Activity/context";

export interface ActivityProps extends PropsWithChildren {
  isActive?: boolean;
  inactiveDelay?: number;
  /** @internal */
  forceCustomActivity?: boolean;
}

const isActivitySupported = React.version.startsWith("19.2");

const CustomActivity: FC<ActivityProps> = (props) => {
  const { children, isActive: isActive = true } = props;

  return (
    <Suspense fallback={null}>
      <SuspenseTrigger show={!isActive} />
      {children}
    </Suspense>
  );
};

export const Activity: FC<ActivityProps> = (props) => {
  const {
    isActive: isActiveFromProps = true,
    inactiveDelay,
    forceCustomActivity = false,
    children,
  } = props;

  const [isActiveState, setIsActiveState] = useState(isActiveFromProps);
  const isSsr = useIsSSR();
  const isParentActive = useIsActivityActive();

  useEffect(() => {
    if (!inactiveDelay) {
      return;
    }

    if (isActiveFromProps) {
      setIsActiveState(true);
    } else {
      const timeout = setTimeout(() => {
        setIsActiveState(false);
      }, inactiveDelay);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isActiveFromProps, inactiveDelay]);

  const isActive = inactiveDelay ? isActiveState : isActiveFromProps;

  /*
   * A hidden subtree keeps rendering, but React commits none of those renders —
   * that holds for React's own `Activity` as much as for the suspended one. Its
   * inline DOM is hidden along with it, yet anything it portalled elsewhere
   * stays on screen, frozen at the last commit: the open Select popover of the
   * tab you just left. So hide one commit after deactivating, which is the
   * commit the subtree needs to unmount its overlays. Setting the state from a
   * layout effect keeps that intermediate commit off the screen.
   */
  const [isHiddenState, setIsHiddenState] = useState(!isActive);

  useLayoutEffect(() => {
    setIsHiddenState(!isActive);
  }, [isActive]);

  const isHidden = isHiddenState && !isActive;

  if (isSsr) {
    return isActive ? children : null;
  }

  const content = (
    <ActivityContextProvider value={isParentActive && isActive}>
      {children}
    </ActivityContextProvider>
  );

  if (isActivitySupported && !forceCustomActivity) {
    return (
      <React.Activity mode={isHidden ? "hidden" : "visible"}>
        {content}
      </React.Activity>
    );
  }

  return <CustomActivity isActive={!isHidden}>{content}</CustomActivity>;
};

export default Activity;
