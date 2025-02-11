import React, { type FC } from "react";

const Fallback: FC = () => null;

const RemoteRenderer = React.lazy(async () => {
  try {
    return await import("@mittwald/flow-remote-react-renderer/RemoteRenderer");
  } catch {
    return { default: Fallback };
  }
});

export const Preview: FC = () => {
  const previewUrl = new URL(document.location.href);
  previewUrl.searchParams.set("preview", "");
  return <RemoteRenderer src={previewUrl.toString()} />;
};

export default Preview;
