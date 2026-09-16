import {
  Button,
  Content,
  Heading,
  Icon,
  Text,
  TunnelEntry,
} from "@mittwald/flow-remote-vue-components";
import { iconSearch } from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent, h } from "vue";

/**
 * The Vue counterpart of `/remote/tunnel`.
 *
 * The tunnel is entirely host-side: the extension marks a subtree with an id
 * and the host renders it wherever that id exits — here, in the demo's own
 * navigation.
 */
export const TunnelDemo = defineComponent({
  name: "TunnelDemo",
  setup: () => () => [
    h(Heading, null, () => "Fleet search"),
    h(TunnelEntry, { id: "remote-demo" }, () =>
      h(Button, null, () => h(Icon, null, () => iconSearch())),
    ),
    h(Content, null, () =>
      h(
        Text,
        null,
        () => "Find the search button in the menu to search the fleet",
      ),
    ),
  ],
});
