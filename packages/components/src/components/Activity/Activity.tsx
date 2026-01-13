import SuspenseTrigger from "@/components/SuspenseTrigger";
import React, { useEffect, useState } from "react";
import { type FC, type PropsWithChildren } from "react";
import { Suspense } from "react";
import { useIsSSR } from "react-aria";

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

  if (isActivitySupported && !forceCustomActivity) {
    return (
      <React.Activity mode={isActive ? "visible" : "hidden"}>
        {children}
      </React.Activity>
    );
  }

  return <CustomActivity isActive={isActive}>{children}</CustomActivity>;
};

export default Activity;
