/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Button,
  Heading,
  Link,
  MenuItem,
  Section,
} from "@mittwald/flow-remote-vue-components";
import { useDemoNavigation } from "@/app/remote-vue/_demos/lib/navigation";
import { Actions, Breadcrumb, Title } from "@/app/remote-vue/_demos/mstudio";
import { defineComponent } from "vue";

/** The Vue counterpart of `/remote/navigation`. */
export const NavigationDemo = defineComponent({
  name: "NavigationDemo",
  setup() {
    const navigate = useDemoNavigation();

    return () => [
      <Title>Fleet</Title>,
      <Section>
        <Heading>Fleet</Heading>
        <Button onPress={() => navigate("navigation/subpage")}>
          Open Death Star
        </Button>
      </Section>,
    ];
  },
});

/** The Vue counterpart of `/remote/navigation/subpage`. */
export const NavigationSubpageDemo = defineComponent({
  name: "NavigationSubpageDemo",
  setup() {
    const navigate = useDemoNavigation();

    return () => [
      <Title>Battle station</Title>,
      <Actions>
        <MenuItem onAction={() => console.log("Rename station")}>
          Rename
        </MenuItem>
        <MenuItem onAction={() => console.log("Decommission station")}>
          Decommission
        </MenuItem>
      </Actions>,
      <Breadcrumb>
        <Link href="/remote-vue/navigation/subpage">Battle station</Link>
      </Breadcrumb>,
      <Section>
        <Heading>Death Star</Heading>
        <Button onPress={() => navigate("navigation")}>Back to fleet</Button>
      </Section>,
    ];
  },
});
