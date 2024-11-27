import { Alert } from "@mittwald/flow-react-components/Alert";
import { AlertIcon } from "@mittwald/flow-react-components/AlertIcon";
import { Content } from "@mittwald/flow-react-components/Content";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Button } from "@mittwald/flow-react-components/Button";
import { Icon } from "@mittwald/flow-react-components/Icon";
import type { RemoteComponentsMap } from "@/lib/types";
import { Modal, ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { Action } from "@mittwald/flow-react-components/Action";
import { Section } from "@mittwald/flow-react-components/Section";
import { Text } from "@mittwald/flow-react-components/Text";
import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { Form } from "@/components/Form";
import type { FlowRemoteElementKeys } from "@mittwald/flow-remote-elements";
import { Input } from "@/components/Input";
import { createFlowRemoteComponentRenderer } from "@/lib/createFlowRemoteComponentRenderer";

export const components: RemoteComponentsMap<FlowRemoteElementKeys> = {
  "flr-action": createRemoteComponentRenderer(Action),
  "flr-alert": createRemoteComponentRenderer(Alert),
  "flr-alert-icon": createRemoteComponentRenderer(AlertIcon),
  "flr-content": createRemoteComponentRenderer(Content),
  "flr-heading": createRemoteComponentRenderer(Heading),
  "flr-button": createFlowRemoteComponentRenderer(Button),
  "flr-icon": createRemoteComponentRenderer(Icon),
  "flr-modal": createRemoteComponentRenderer(Modal),
  "flr-modal-trigger": createRemoteComponentRenderer(ModalTrigger),
  "flr-section": createRemoteComponentRenderer(Section),
  "flr-text": createRemoteComponentRenderer(Text),
  "flr-input": createRemoteComponentRenderer(Input),
  "flr-form": createRemoteComponentRenderer(Form),
};
