import Button from "@mittwald/flow-react-components/Button";
import { Action } from "@mittwald/flow-react-components/Action";
import { sleepLong } from "@/content/02-components/actions/action/examples/lib";

<Action action={() => sleepLong()}>
  <Button>Save</Button>
</Action>;
