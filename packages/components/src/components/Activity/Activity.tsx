import type { ComponentType, FC, PropsWithChildren } from "react";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useIsSSR } from "react-aria";

export interface ActivityProps extends PropsWithChildren {
  isActive?: boolean;
  inactiveDelay?: number;
}

const nonResolvingPromise = new Promise<{ default: ComponentType<unknown> }>(
  () => {
    // no resolve
  },
);

const SuspenseTrigger = lazy(() => nonResolvingPromise);

/** @flr-generate all */
export const Activity: FC<ActivityProps> = (props) => {
  const { children, isActive: isActiveFromProps = true, inactiveDelay } = props;

  const [isActiveState, setIsActiveState] = useState(isActiveFromProps);
  const isSsr = useIsSSR();

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

  if (isSsr) {
    return isActive ? children : null;
  }

  return (
    <Suspense fallback={null}>
      {!isActive && <SuspenseTrigger />}
      {children}
    </Suspense>
  );
};
