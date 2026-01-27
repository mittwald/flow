import {
  Action,
  Button,
} from "@mittwald/flow-react-components";

<Action onAction={() => console.log("close modal")}>
  <Action onAction={() => console.log("save")}>
    <Button color="accent">Speichern</Button>
  </Action>
</Action>;
