import SuspenseTrigger from "@/components/SuspenseTrigger";
import {
  Activity as ReactsActivity,
  type FC,
  type PropsWithChildren,
} from "react";
import { Suspense } from "react";
import { useIsSSR } from "react-aria";

export interface ActivityProps extends PropsWithChildren {
  isActive?: boolean;
}

/** @internal */
export const CustomActivity: FC<ActivityProps> = (props) => {
  const { children, isActive: isActive = true } = props;

  const isSsr = useIsSSR();

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

export const Activity: FC<ActivityProps> = (props) => {
  const { isActive, children } = props;

  if (ReactsActivity) {
    return (
      <ReactsActivity mode={isActive ? "visible" : "hidden"}>
        {children}
      </ReactsActivity>
    );
  }

  return <CustomActivity {...props} />;
};

export default Activity;
