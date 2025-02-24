"use client";
import type { RootClientProps } from "@/components/RemoteRootClient";
import { useIsMounted } from "@/hooks/useIsMounted";
import React, { type FC, Suspense } from "react";

const ClientComponent = React.lazy(() => import("./RemoteRootClient"));

export const RemoteRoot: FC<RootClientProps> = (props) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <Suspense fallback={props.fallback}>
      <ClientComponent {...props} />
    </Suspense>
  );
};

export default RemoteRoot;
