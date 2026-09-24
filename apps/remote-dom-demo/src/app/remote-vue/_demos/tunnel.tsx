/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Button,
  Content,
  Heading,
  IconSearch,
  Text,
  TunnelEntry,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

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
    <Heading>Fleet search</Heading>,
    <TunnelEntry id="remote-demo">
      <Button>
        <IconSearch />
      </Button>
    </TunnelEntry>,
    <Content>
      <Text>
        Find the <IconSearch size="s" /> in the menu to search the fleet
      </Text>
    </Content>,
  ],
});
