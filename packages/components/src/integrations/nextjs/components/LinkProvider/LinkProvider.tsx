import type { FC, PropsWithChildren } from "react";
import React from "react";
import NextJsSupportedLink from "@/integrations/nextjs/components/Link";
import { LinkContextProvider } from "@/components/Link/context";

export const LinkProvider: FC<PropsWithChildren> = (props) => (
  <LinkContextProvider value={{ linkComponent: NextJsSupportedLink }}>
    {props.children}
  </LinkContextProvider>
);

export default LinkProvider;
