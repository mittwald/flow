import {
  Action,
  ActionGroup,
  Button,
  Content,
  Flex,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  Section,
  Text,
  TextField,
  useOverlayController,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, type VNode } from "vue";

const squadronExplainer =
  "Think of a squadron as your crew. This is where you rally your pilots, " +
  "assign ships, and plan your next mission.";

const squadronFields = () =>
  h(Section, null, () => [
    h(Heading, null, () => "What is a squadron?"),
    h(Text, null, () => squadronExplainer),
    h(TextField, { isRequired: true }, () =>
      h(Label, null, () => "Squadron name"),
    ),
  ]);

const confirmOnCloseFields = () =>
  h(Section, null, () => [
    h(
      Text,
      null,
      () =>
        "Closing this modal with Escape or with a click outside has to be confirmed. Cancel closes it right away.",
    ),
    h(TextField, { isRequired: true }, () =>
      h(Label, null, () => "Squadron name"),
    ),
  ]);

const squadronModalContent = (body: () => VNode | VNode[]) => [
  h(Heading, null, () => "New squadron"),
  h(Content, null, body),
  h(ActionGroup, null, () => [
    h(Action, { closeModal: true }, () =>
      h(Button, { color: "success" }, () => "Create squadron"),
    ),
    h(Action, { closeModal: true }, () =>
      h(Button, { variant: "soft", color: "secondary" }, () => "Cancel"),
    ),
  ]),
];

/**
 * The Vue counterpart of `/remote/modal`.
 *
 * Written against the same API as the React page — `ModalTrigger`, `Modal`,
 * `Action closeModal`, a controller — except that all four are this package's
 * Vue rebuilds of Flow's React-only components, not remote elements.
 */
export const ModalDemo = defineComponent({
  name: "ModalDemo",

  setup() {
    const controller = useOverlayController();

    return () =>
      h(Section, null, () => [
        h(Flex, { columnGap: "s" }, () => [
          h(ModalTrigger, null, () => [
            h(Button, null, () => "New squadron"),
            h(Modal, null, () => squadronModalContent(squadronFields)),
          ]),

          h(ModalTrigger, null, () => [
            h(Button, { variant: "outline" }, () => "Offcanvas"),
            h(Modal, { offCanvas: true, size: "m" }, () =>
              squadronModalContent(() => [squadronFields(), squadronFields()]),
            ),
          ]),

          h(ModalTrigger, null, () => [
            h(Button, null, () => "Confirm on close"),
            h(Modal, { confirmOnClose: true }, () =>
              squadronModalContent(confirmOnCloseFields),
            ),
          ]),
        ]),

        h(Label, null, () => "With controller"),
        h(Button, { onPress: controller.open }, () => "New squadron"),
        h(Modal, { controller }, () => squadronModalContent(squadronFields)),
      ]);
  },
});
