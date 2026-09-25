/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Alert,
  Button,
  Content,
  Heading,
  Label,
  Text,
  TextField,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/** The Vue counterpart of `/remote/non-interactive`. */
export const NonInteractiveDemo = defineComponent({
  name: "NonInteractiveDemo",
  setup: () => () => (
    <Alert status="danger">
      <Heading>Mission failed</Heading>
      <Text>The assault on the Death Star could not be completed.</Text>
      <TextField>
        <Label>Mission name</Label>
      </TextField>
      <Content>
        <Button>Retry</Button>
      </Content>
    </Alert>
  ),
});
