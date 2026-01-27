import {
  Action,
  Button,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/04-components/actions/action/examples/lib";

<Action onAction={sleepLong}>
  <Button color="accent">Speichern</Button>
</Action>;
