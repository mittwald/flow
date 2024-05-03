import type { FC, PropsWithChildren, ReactNode } from "react";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { useIsSSR } from "react-aria";

interface Props extends PropsWithChildren {
  isActive?: boolean;
  inactiveDelay?: number;
  fallback?: ReactNode;
}

const SuspenseTrigger = lazy(
  () =>
    new Promise(() => {
      // no resolve
    }),
);

export const Activity: FC<Props> = (props) => {
  const {
    children,
    isActive: isActiveFromProps = true,
    inactiveDelay,
    fallback,
  } = props;

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
    <Suspense fallback={fallback}>
      {children}
      {!isActive && <SuspenseTrigger />}
    </Suspense>
  );
};
