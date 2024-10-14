import "@mittwald/flow-remote-elements";
import { Alert } from "@mittwald/flow-react-components/Alert";
import { AlertIcon } from "@mittwald/flow-react-components/AlertIcon";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Button } from "@mittwald/flow-react-components/Button";
import { Icon } from "@mittwald/flow-react-components/Icon";
import { createFlowRemoteComponentsRenderer } from "@/lib/createFlowRemoteComponentsRenderer";
import type { RemoteComponentsMap } from "@/lib/types";

export const components: RemoteComponentsMap = {
  "flr-alert": createFlowRemoteComponentsRenderer(Alert),
  "flr-alert-icon": createFlowRemoteComponentsRenderer(AlertIcon),
  "flr-heading": createFlowRemoteComponentsRenderer(Heading),
  "flr-button": createFlowRemoteComponentsRenderer(Button),
  "flr-icon": createFlowRemoteComponentsRenderer(Icon),
};
