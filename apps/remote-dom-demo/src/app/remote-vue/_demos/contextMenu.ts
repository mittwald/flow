import {
  Action,
  ActionGroup,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Header,
  Heading,
  IconApp,
  MenuItem,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

const stationActions = () =>
  h(ContextMenuTrigger, null, () => [
    h(Button, null, () => "Station actions"),
    h(ContextMenu, { onAction: (item: unknown) => console.log(item) }, () => [
      h(MenuItem, null, () => [
        h(IconApp),
        h(Text, null, () => "Fire superlaser"),
      ]),
      h(MenuItem, null, () => "Rotate station"),
      h(MenuItem, null, () => "Scan sector"),
      h(MenuItem, null, () => "Self-destruct"),
    ]),
  ]);

/** The Vue counterpart of `/remote/context-menu`. */
export const ContextMenuDemo = defineComponent({
  name: "ContextMenuDemo",
  setup: () => () =>
    h(Section, null, () => [
      h(Header, null, () => [
        h(Heading, null, () => "Death Star"),
        h(ModalTrigger, null, () => [
          h(Button, null, () => "Battle station controls"),
          h(Modal, null, () => [
            h(Heading, null, () => "Battle station controls"),
            h(Content, null, () => "Command the Death Star's systems."),
            h(ActionGroup, null, () =>
              h(Action, { closeModal: true }, () =>
                h(Button, null, () => "Close"),
              ),
            ),
          ]),
        ]),
        stationActions(),
      ]),
      h(Content, null, () => stationActions()),
    ]),
});
