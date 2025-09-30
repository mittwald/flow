import type { FC, PropsWithChildren } from "react";
import { memo } from "react";
import type { FlowComponentName } from "@/components/propTypes";
import { slotContext, useSlotContext } from "@/lib/slotContext/slotContext";

interface Props extends PropsWithChildren {
  slot: string;
  component: FlowComponentName;
}

const Provider = memo(slotContext.Provider);
Provider.displayName = "SlotContextProviderInner";

export const SlotContextProvider: FC<Props> = memo((props) => {
  const { slot, component, children } = props;
  const parentContext = useSlotContext();

  const mergedContext = {
    ...parentContext,
    [component]: slot,
  };

  return <Provider value={mergedContext}>{children}</Provider>;
});
SlotContextProvider.displayName = "SlotContextProvider";

export default SlotContextProvider;
