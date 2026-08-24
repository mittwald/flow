import {
  Action,
  Button,
} from "@mittwald/flow-react-components";

<Action
  onAction={() =>
    new Promise((resolve) => setTimeout(resolve, 1500))
  }
>
  <Button color="success">Speichern</Button>
</Action>;
