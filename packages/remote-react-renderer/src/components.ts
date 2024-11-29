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
import { SimpleForm } from "@/components/SimpleForm";
import type { FlowRemoteElementKeys } from "@mittwald/flow-remote-elements";
import { SimpleInput } from "@/components/SimpleInput";
import { createFlowRemoteComponentRenderer } from "@/lib/createFlowRemoteComponentRenderer";
import CodeBlock from "@mittwald/flow-react-components/CodeBlock";
import TextField from "@mittwald/flow-react-components/TextField";
import {
  List,
  ListItem,
  ListStaticData,
} from "@mittwald/flow-react-components/List";

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
  "flr-code-block": createRemoteComponentRenderer(CodeBlock),
  "flr-simple-input": createRemoteComponentRenderer(SimpleInput),
  "flr-simple-form": createRemoteComponentRenderer(SimpleForm),
  "flr-text-field": createFlowRemoteComponentRenderer(TextField),
  "flr-list": createFlowRemoteComponentRenderer(List),
  "flr-list-item": createFlowRemoteComponentRenderer(ListItem),
  "flr-list-static-data": createFlowRemoteComponentRenderer(ListStaticData),
};
