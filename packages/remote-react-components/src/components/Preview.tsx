import React, { type FC, type ReactNode } from "react";

const Fallback: FC = () => null;

const RemoteRenderer = React.lazy(async () => {
  try {
    return await import("@mittwald/flow-remote-react-renderer/RemoteRenderer");
  } catch {
    return { default: Fallback };
  }
});

interface Props {
  data?: unknown;
  fallback?: ReactNode;
}

export const Preview: FC<Props> = (props) => {
  const previewUrl = new URL(document.location.href);
  previewUrl.searchParams.set("preview", "");
  return <RemoteRenderer src={previewUrl.toString()} {...props} />;
};

export default Preview;
