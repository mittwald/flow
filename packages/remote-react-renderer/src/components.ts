import { Alert } from "@mittwald/flow-react-components/Alert";
import { AlertIcon } from "@mittwald/flow-react-components/AlertIcon";
import { Content } from "@mittwald/flow-react-components/Content";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Button } from "@mittwald/flow-react-components/Button";
import { Icon } from "@mittwald/flow-react-components/Icon";
import { createFlowRemoteComponentRenderer } from "@/lib/createFlowRemoteComponentRenderer";
import type { RemoteComponentsMap } from "@/lib/types";
import { Modal, ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { Action } from "@mittwald/flow-react-components/Action";
import { Section } from "@mittwald/flow-react-components/Section";
import { Text } from "@mittwald/flow-react-components/Text";
import { createRemoteComponentRenderer } from "@remote-dom/react/host";
import { Form } from "@/components/Form";
import type { FlowRemoteElementKeys } from "@mittwald/flow-remote-elements";
import { Input } from "@/components/Input";

export const components: RemoteComponentsMap<FlowRemoteElementKeys> = {
  "flr-action": createFlowRemoteComponentRenderer(Action),
  "flr-alert": createFlowRemoteComponentRenderer(Alert),
  "flr-alert-icon": createFlowRemoteComponentRenderer(AlertIcon),
  "flr-content": createFlowRemoteComponentRenderer(Content),
  "flr-heading": createFlowRemoteComponentRenderer(Heading),
  "flr-button": createFlowRemoteComponentRenderer(Button),
  "flr-icon": createFlowRemoteComponentRenderer(Icon),
  "flr-modal": createFlowRemoteComponentRenderer(Modal),
  "flr-modal-trigger": createFlowRemoteComponentRenderer(ModalTrigger),
  "flr-section": createFlowRemoteComponentRenderer(Section),
  "flr-text": createFlowRemoteComponentRenderer(Text),
  "flr-input": createRemoteComponentRenderer(Input),
  "flr-form": createRemoteComponentRenderer(Form),
};
