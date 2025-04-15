import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";
import { useIsMounted } from "@mittwald/flow-react-components";
import React, { type FC } from "react";

const LazyRemoteRenderer = React.lazy(
  () => import("@mittwald/flow-remote-react-renderer/RemoteRenderer"),
);

interface Props {
  extBridgeImplementation?: ExtBridgeRemoteApi;
}

export const Preview: FC<Props> = (props) => {
  const isMounted = useIsMounted();
  if (!isMounted) {
    return null;
  }

  const previewUrl = new URL(document.location.href);
  previewUrl.searchParams.set("preview", "");
  return <LazyRemoteRenderer src={previewUrl.toString()} {...props} />;
};

export default Preview;
