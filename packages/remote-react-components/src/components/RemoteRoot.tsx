"use client";
import type { RootClientProps } from "@/components/RemoteRootClient";
import { useIsMounted } from "@/hooks/useIsMounted";
import React, { type FC, Suspense } from "react";
import { HostDataProvider } from "./HostDataContextProvider";

const ClientComponent = React.lazy(() => import("./RemoteRootClient"));

export const RemoteRoot: FC<RootClientProps> = (props) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <HostDataProvider>
        <ClientComponent {...props} />
      </HostDataProvider>
    </Suspense>
  );
};

export default RemoteRoot;
