"use client";
import { type FC, Suspense } from "react";
import React from "react";
import { useIsMounted } from "~/hooks/useIsMounted";
import type { RootClientProps } from "~/components/RemoteRootClient";

const ClientComponent = React.lazy(() => import("./RemoteRootClient"));

export const RemoteRoot: FC<RootClientProps> = (props) => {
  const { children, ...rest } = props;
  const isMounted = useIsMounted();
  return isMounted ? (
    <Suspense>
      <ClientComponent {...rest}>{children}</ClientComponent>
    </Suspense>
  ) : null;
};

export default RemoteRoot;
