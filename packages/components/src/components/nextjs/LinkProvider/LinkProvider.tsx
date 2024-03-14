import React, { FC, PropsWithChildren } from "react";
import { PropsContextProvider } from "@/lib/propsContext";
import Link from "@/components/nextjs/Link";

export const LinkProvider: FC<PropsWithChildren> = (props) => (
  <PropsContextProvider
    props={{
      Link: { linkComponent: Link },
      NavigationItem: { linkComponent: Link },
    }}
  >
    {props.children}
  </PropsContextProvider>
);

export default LinkProvider;
