import {
  Button,
  Heading,
  Label,
  Option,
  Popover,
  PopoverTrigger,
  Section,
  Select,
  Tab,
  Tabs,
  TabTitle,
  Text,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/** The Vue counterpart of `/remote/activity`. */
export const ActivityDemo = defineComponent({
  name: "ActivityDemo",
  setup: () => () =>
    h(Tabs, { "aria-label": "Hangar bay" }, () => [
      h(Tab, { id: "manifest" }, () => [
        h(TabTitle, null, () => "Manifest"),
        h(Section, null, () => [
          h(Heading, null, () => "Manifest"),
          h(
            Text,
            null,
            () =>
              "Type a name, switch to the paint job and come back. The entry is still there: an inactive tab is deactivated, not unmounted, so the panel keeps its state.",
          ),
          h(TextField, null, () => h(Label, null, () => "Freighter name")),
        ]),
      ]),

      h(Tab, { id: "paint" }, () => [
        h(TabTitle, null, () => "Paint job"),
        h(Section, null, () => [
          h(Heading, null, () => "Paint job"),
          h(
            Text,
            null,
            () =>
              "Open the hull colour list, then double-click the manifest tab. The list must be gone: a deactivated panel keeps rendering but never commits again, so an overlay it left on screen would hang over the tab you switched to forever.",
          ),
          h(Select, null, () => [
            h(Label, null, () => "Hull colour"),
            h(Option, null, () => "Imperial grey"),
            h(Option, null, () => "Rebel orange"),
            h(Option, null, () => "Corellian red"),
            h(Option, null, () => "Kessel rust"),
          ]),
          h(PopoverTrigger, null, () => [
            h(Button, null, () => "Hangar notes"),
            h(Popover, null, () =>
              h(
                Text,
                null,
                () => "Leave the tab while this is open — it must not survive.",
              ),
            ),
          ]),
        ]),
      ]),
    ]),
});
