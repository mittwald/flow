import {
  Button,
  Heading,
  Link,
  MenuItem,
  Section,
} from "@mittwald/flow-remote-vue-components";
import { useDemoNavigation } from "@/app/remote-vue/_demos/lib/navigation";
import { Actions, Breadcrumb, Title } from "@/app/remote-vue/_demos/mstudio";
import { defineComponent, h } from "vue";

/** The Vue counterpart of `/remote/navigation`. */
export const NavigationDemo = defineComponent({
  name: "NavigationDemo",
  setup() {
    const navigate = useDemoNavigation();

    return () => [
      h(Title, null, () => "Fleet"),
      h(Section, null, () => [
        h(Heading, null, () => "Fleet"),
        h(
          Button,
          { onPress: () => navigate("navigation/subpage") },
          () => "Open Death Star",
        ),
      ]),
    ];
  },
});

/** The Vue counterpart of `/remote/navigation/subpage`. */
export const NavigationSubpageDemo = defineComponent({
  name: "NavigationSubpageDemo",
  setup() {
    const navigate = useDemoNavigation();

    return () => [
      h(Title, null, () => "Battle station"),
      h(Actions, null, () => [
        h(
          MenuItem,
          { onAction: () => console.log("Rename station") },
          () => "Rename",
        ),
        h(
          MenuItem,
          { onAction: () => console.log("Decommission station") },
          () => "Decommission",
        ),
      ]),
      h(Breadcrumb, null, () =>
        h(
          Link,
          { href: "/remote-vue/navigation/subpage" },
          () => "Battle station",
        ),
      ),
      h(Section, null, () => [
        h(Heading, null, () => "Death Star"),
        h(
          Button,
          { onPress: () => navigate("navigation") },
          () => "Back to fleet",
        ),
      ]),
    ];
  },
});
