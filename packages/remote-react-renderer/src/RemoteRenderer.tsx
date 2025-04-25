"use client";
import type { RemoteRendererBrowserProps } from "@/RemoteRendererBrowser";
import { BrowserOnly } from "@mittwald/flow-react-components";
import React from "react";
import type { FC } from "react";

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
