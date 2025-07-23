import SuspenseTrigger from "@/components/SuspenseTrigger";
import type { FC, PropsWithChildren } from "react";
import { Suspense, useEffect, useState } from "react";
import { useIsSSR } from "react-aria";

export interface ActivityProps extends PropsWithChildren {
  isActive?: boolean;
  inactiveDelay?: number;
}

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
      <SuspenseTrigger show={!isActive} />
      {children}
    </Suspense>
  );
};
export default Activity;
