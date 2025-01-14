import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";
import React from "react";
import { useContext } from "react";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

interface Props extends PropsWithChildren {
  components: Partial<FlowViewComponents>;
}

export const ViewComponentContextProvider: FC<Props> = (props) => {
  const { children, components } = props;

  const parentContext = useContext(viewComponentContext);

  const mergedContext = useMemo(
    () => ({
      ...parentContext,
      ...components,
    }),
    [parentContext, components],
  );

  return (
    <viewComponentContext.Provider value={mergedContext}>
      {children}
    </viewComponentContext.Provider>
  );
};
