import { Alert } from "@mittwald/flow-react-components/Alert";
import { AlertIcon } from "@mittwald/flow-react-components/AlertIcon";
import { Content } from "@mittwald/flow-react-components/Content";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Button } from "@mittwald/flow-react-components/Button";
import { Icon } from "@mittwald/flow-react-components/Icon";
import { createFlowRemoteComponentsRenderer } from "@/lib/createFlowRemoteComponentsRenderer";
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
  "flr-action": createFlowRemoteComponentsRenderer(Action),
  "flr-alert": createFlowRemoteComponentsRenderer(Alert),
  "flr-alert-icon": createFlowRemoteComponentsRenderer(AlertIcon),
  "flr-content": createFlowRemoteComponentsRenderer(Content),
  "flr-heading": createFlowRemoteComponentsRenderer(Heading),
  "flr-button": createFlowRemoteComponentsRenderer(Button),
  "flr-icon": createFlowRemoteComponentsRenderer(Icon),
  "flr-modal": createFlowRemoteComponentsRenderer(Modal),
  "flr-modal-trigger": createFlowRemoteComponentsRenderer(ModalTrigger),
  "flr-section": createFlowRemoteComponentsRenderer(Section),
  "flr-text": createFlowRemoteComponentsRenderer(Text),
  "flr-input": createRemoteComponentRenderer(Input),
  "flr-form": createRemoteComponentRenderer(Form),
};
