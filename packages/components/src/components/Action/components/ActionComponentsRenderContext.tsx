import type { FC, PropsWithChildren } from "react";
import React from "react";
import { PropsContextProvider } from "@/lib/propsContext";
import { ActionButton } from "@/components/Action/components/ActionButton";
import { ActionLink } from "@/components/Action/components/ActionLink";

export const ActionComponentsRenderContext: FC<PropsWithChildren> = (props) => (
  <PropsContextProvider
    props={{
      Button: { render: ActionButton },
      Link: {
        render: ActionLink,
      },
    }}
    mergeInParentContext
  >
    {props.children}
  </PropsContextProvider>
);
