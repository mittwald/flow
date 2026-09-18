import {
  AlertIcon,
  Link,
  TabNavigation,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/** The Vue counterpart of `/remote/tab-navigation`. */
export const TabNavigationDemo = defineComponent({
  name: "TabNavigationDemo",
  setup: () => () =>
    h(TabNavigation, { "aria-label": "Project navigation" }, () => [
      h(Link, { href: "#" }, () => "Apps"),
      h(Link, { href: "#", "aria-current": "page" }, () => "Container"),
      h(Link, { href: "#" }, () => "Domains"),
      h(Link, { href: "#" }, () => "E-Mails"),
      h(Link, { href: "#" }, () => [
        "Databases",
        h(AlertIcon, { status: "warning" }),
      ]),
      h(Link, { href: "#" }, () => "Backups"),
    ]),
});
