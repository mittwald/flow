import type { FC, PropsWithChildren } from "react";
import React from "react";
import { connectHostIframeRef } from "@mittwald/flow-remote-core";

type Props = PropsWithChildren;

export const FlowRemoteReactProvider: FC<Props> = (props) => {
  const { children } = props;
  return <div ref={connectHostIframeRef}>{children}</div>;
};
