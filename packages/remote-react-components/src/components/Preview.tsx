import type { ExtBridgeFunctions } from "@mittwald/ext-bridge";
import React, { type FC } from "react";

const LazyRemoteRenderer = React.lazy(
  () => import("@mittwald/flow-remote-react-renderer/RemoteRenderer"),
);

interface Props {
  extBridgeImplementation?: ExtBridgeFunctions;
}

export const Preview: FC<Props> = (props) => {
  const previewUrl = new URL(document.location.href);
  previewUrl.searchParams.set("preview", "");
  return <LazyRemoteRenderer src={previewUrl.toString()} {...props} />;
};

export default Preview;
