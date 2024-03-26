import Button from "@mittwald/flow-react-components/Button";
import { Action } from "@mittwald/flow-react-components/Action";
import { sleep } from "@/content/02-components/actions/action/examples/lib";

<Action action={() => sleep()}>
  <Button>Save</Button>
</Action>;
