import { lazy, type ComponentType, type FC } from "react";

export interface SuspenseTriggerProps {
  show?: boolean;
}

const nonResolvingPromise = new Promise<{ default: ComponentType<unknown> }>(
  () => {
    // no resolve
  },
);

const NonResolvingLazy = lazy(() => nonResolvingPromise);

export const SuspenseTrigger: FC<SuspenseTriggerProps> = (props) => {
  const { show = true } = props;
  return show ? <NonResolvingLazy /> : null;
};

export default SuspenseTrigger;
