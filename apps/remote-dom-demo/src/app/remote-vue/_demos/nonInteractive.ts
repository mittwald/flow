import {
  Alert,
  Button,
  Content,
  Heading,
  Label,
  Text,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/** The Vue counterpart of `/remote/non-interactive`. */
export const NonInteractiveDemo = defineComponent({
  name: "NonInteractiveDemo",
  setup: () => () =>
    h(Alert, { status: "danger" }, () => [
      h(Heading, null, () => "Mission failed"),
      h(
        Text,
        null,
        () => "The assault on the Death Star could not be completed.",
      ),
      h(TextField, null, {
        default: () => h(Label, null, () => "Mission name"),
      }),
      h(Content, null, () => h(Button, null, () => "Retry")),
    ]),
});
