"use client";
import type { FC } from "react";
import React from "react";
import { useIsMounted } from "~/hooks/useIsMounted";
import type { RootClientProps } from "~/components/RootClient";

const RootClient = React.lazy(() => import("./RootClient"));

export const Root: FC<RootClientProps> = (props) => {
  const { children, ...rest } = props;
  const isMounted = useIsMounted();
  return isMounted ? <RootClient {...rest}>{children}</RootClient> : null;
};

export default Root;
