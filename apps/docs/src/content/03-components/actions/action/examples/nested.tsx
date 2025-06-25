import {
  Action,
  Button,
} from "@mittwald/flow-react-components";

<Action action={() => console.log("close modal")}>
  <Action action={() => console.log("save")}>
    <Button color="accent">Speichern</Button>
  </Action>
</Action>;
