import type { FC, PropsWithChildren } from "react";
import { Link } from "@/integrations/nextjs/components/Link";
import { LinkContextProvider } from "@/components/Link/context";

/** @deprecated Use RouterProvider instead */
export const LinkProvider: FC<PropsWithChildren> = (props) => (
  <LinkContextProvider value={{ linkComponent: Link }}>
    {props.children}
  </LinkContextProvider>
);

export default LinkProvider;
