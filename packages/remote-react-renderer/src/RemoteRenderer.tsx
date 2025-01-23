"use client";
import type { FC } from "react";
import React from "react";
import { useIsMounted } from "~/hooks/useIsMounted";
import type { RemoteRendererProps } from "~/RemoteRendererClient";

const RemoteRendererClient = React.lazy(() => import("./RemoteRendererClient"));

export const RemoteRenderer: FC<RemoteRendererProps> = (props) => {
  const isMounted = useIsMounted();
  return isMounted ? <RemoteRendererClient {...props} /> : null;
};

export default RemoteRenderer;
