import type { FC, PropsWithChildren } from "react";
import React from "react";
import type { FlowComponentName } from "@/components/propTypes";
import { slotContext, useSlotContext } from "@/lib/slotContext/slotContext";

interface Props extends PropsWithChildren {
  slot: string;
  component: FlowComponentName;
}

export const SlotContextProvider: FC<Props> = (props) => {
  const { slot, component, children } = props;
  const parentContext = useSlotContext();

  const mergedContext = {
    ...parentContext,
    [component]: slot,
  };

  return (
    <slotContext.Provider value={mergedContext}>
      {children}
    </slotContext.Provider>
  );
};

export default SlotContextProvider;
