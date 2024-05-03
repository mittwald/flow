import type { FC, PropsWithChildren } from "react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useIsSSR } from "react-aria";

interface Props extends PropsWithChildren {
  isActive?: boolean;
  inactiveDelay?: number;
}

const SuspenseTrigger: FC = () => {
  throw useRef(
    new Promise(() => {
      // do nothing
    }),
  ).current;
};

export const Activity: FC<Props> = (props) => {
  const { children, isActive: isActiveFromProps = true, inactiveDelay } = props;

  const [isActiveState, setIsActiveState] = useState(isActiveFromProps);

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

  const isSsr = useIsSSR();

  if (isSsr) {
    return isActive ? children : null;
  }

  return (
    <Suspense>
      {children}
      {!isActive && <SuspenseTrigger />}
    </Suspense>
  );
};
