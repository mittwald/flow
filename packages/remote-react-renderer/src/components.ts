import { Alert } from "@mittwald/flow-react-components/Alert";
import { AlertIcon } from "@mittwald/flow-react-components/AlertIcon";
import { Content } from "@mittwald/flow-react-components/Content";
import { Fragment } from "@mittwald/flow-react-components/Fragment";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Button } from "@mittwald/flow-react-components/Button";
import { Icon } from "@mittwald/flow-react-components/Icon";
import type { RemoteComponentsMap } from "@/lib/types";
import { Modal, ModalTrigger } from "@mittwald/flow-react-components/Modal";
import { Action } from "@mittwald/flow-react-components/Action";
import { Section } from "@mittwald/flow-react-components/Section";
import { Text } from "@mittwald/flow-react-components/Text";
import {
  createRemoteComponentRenderer,
  RemoteFragmentRenderer,
} from "@remote-dom/react/host";
import { Form } from "@/components/Form";
import type { FlowRemoteElementKeys } from "@mittwald/flow-remote-elements";
import { createFlowRemoteComponentRenderer } from "@/lib/createFlowRemoteComponentRenderer";
import CodeBlock from "@mittwald/flow-react-components/CodeBlock";
import TextField from "@mittwald/flow-react-components/TextField";
import { List, ListItem } from "@mittwald/flow-react-components/List";
import * as ListViews from "@mittwald/flow-react-components/List/Views";
import { Activity } from "@mittwald/flow-react-components/Activity";
import { stringChildrenExtractor } from "@/lib/stringChildrenExtractor";
import Select, { Option } from "@mittwald/flow-react-components/Select";
import { elementFactory } from "@/lib/elementFactory";

export const components: RemoteComponentsMap<
  FlowRemoteElementKeys | "svg" | "circle" | "g" | "path" | "remote-fragment"
> = {
  "flr-action": createRemoteComponentRenderer(Action),
  "flr-activity": createRemoteComponentRenderer(Activity),
  "flr-alert": createRemoteComponentRenderer(Alert),
  "flr-alert-icon": createRemoteComponentRenderer(AlertIcon),
  "flr-content": createRemoteComponentRenderer(Content),
  "flr-fragment": createRemoteComponentRenderer(Fragment),
  "flr-heading": createRemoteComponentRenderer(Heading),
  "flr-button": createFlowRemoteComponentRenderer(Button),
  "flr-option": createFlowRemoteComponentRenderer(Option),
  "flr-select": createFlowRemoteComponentRenderer(Select),
  "flr-icon": createRemoteComponentRenderer(stringChildrenExtractor(Icon)),
  "flr-modal": createRemoteComponentRenderer(Modal),
  "flr-modal-trigger": createRemoteComponentRenderer(ModalTrigger),
  "flr-section": createRemoteComponentRenderer(Section),
  "flr-text": createRemoteComponentRenderer(Text),
  "flr-code-block": createRemoteComponentRenderer(CodeBlock),
  "flr-form": createFlowRemoteComponentRenderer(Form),
  "flr-text-field": createFlowRemoteComponentRenderer(TextField),

  "flr-list": createFlowRemoteComponentRenderer(List),
  "flr-list-items": createFlowRemoteComponentRenderer(ListViews.Items),
  "flr-list-item": createFlowRemoteComponentRenderer(ListViews.Item),
  "flr-list-header": createRemoteComponentRenderer(ListViews.Header),
  "flr-list-active-filter-list": createFlowRemoteComponentRenderer(
    ListViews.ActiveFilterList,
  ),
  "flr-list-active-filter-item": createFlowRemoteComponentRenderer(
    ListViews.ActiveFilterItem,
  ),
  "flr-list-filter-picker": createFlowRemoteComponentRenderer(
    ListViews.FilterPicker,
  ),
  "flr-list-filter-picker-menu-item": createFlowRemoteComponentRenderer(
    ListViews.FilterPickerMenuItem,
  ),

  "remote-fragment": RemoteFragmentRenderer,

  svg: createRemoteComponentRenderer(elementFactory("svg")),
  circle: createRemoteComponentRenderer(elementFactory("circle")),
  g: createRemoteComponentRenderer(elementFactory("g")),
  path: createRemoteComponentRenderer(elementFactory("path")),
};
