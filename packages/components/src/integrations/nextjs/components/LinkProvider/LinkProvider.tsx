import type { FC, PropsWithChildren } from "react";
import { Link } from "@/integrations/nextjs/components/Link";
import { LinkContextProvider } from "@/components/Link/context";
import { useWarnDeprecation } from "@/components/DeprecationWarningProvider";

/** @deprecated Use RouterProvider instead */
export const LinkProvider: FC<PropsWithChildren> = (props) => {
  const warnDeprecation = useWarnDeprecation();
  warnDeprecation(
    "The 'LinkProvider' component is deprecated and will be removed in a future release. Use 'RouterProvider' instead.",
  );

  return (
    <LinkContextProvider value={{ linkComponent: Link }}>
      {props.children}
    </LinkContextProvider>
  );
};

export default LinkProvider;
