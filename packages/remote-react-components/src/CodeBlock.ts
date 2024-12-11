import { createRemoteComponent } from "@remote-dom/react";
import { RemoteCodeBlockElement } from "@mittwald/flow-remote-elements";

export const CodeBlock = createRemoteComponent(
  "flr-code-block",
  RemoteCodeBlockElement,
  {},
);
