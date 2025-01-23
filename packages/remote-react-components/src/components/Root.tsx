"use client";
import type { FC, PropsWithChildren } from "react";
import React from "react";
import { useIsMounted } from "~/hooks/useIsMounted";

type Props = PropsWithChildren;

const RootClient = React.lazy(() => import("./RootClient"));

export const Root: FC<Props> = (props) => {
  const { children } = props;
  const isMounted = useIsMounted();
  return isMounted ? <RootClient>{children}</RootClient> : null;
};

export default Root;
