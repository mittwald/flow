"use client";
import type { RemoteRendererBrowserProps } from "@/RemoteRendererBrowser";
import { BrowserOnly } from "@mittwald/flow-react-components";
import type { RemoteReadyEvent } from "@mittwald/flow-remote-core";
import React, { type FC } from "react";

export type { RemoteRendererBrowserProps } from "@/RemoteRendererBrowser";
export type { RemoteReadyEvent };

const RemoteRendererBrowser = React.lazy(
  () => import("./RemoteRendererBrowser"),
);

export const RemoteRenderer: FC<RemoteRendererBrowserProps> = (props) => {
  return (
    <BrowserOnly>
      <RemoteRendererBrowser {...props} />
    </BrowserOnly>
  );
};

export default RemoteRenderer;
