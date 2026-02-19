import { sleep } from "@/content/04-components/actions/action/examples/lib";
import {
  abortAction,
  Action,
  Button,
} from "@mittwald/flow-react-components";

<Action
  onAction={() => {
    console.log("Outer action");
  }}
>
  <Action
    onAction={async () => {
      await sleep();
      console.log("Inner action");
      abortAction();
    }}
  >
    <Button>Start action</Button>
  </Action>
</Action>;
