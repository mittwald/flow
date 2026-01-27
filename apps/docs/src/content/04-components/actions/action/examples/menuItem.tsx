import {
  Action,
  Button,
  ContextMenuTrigger,
  ContextMenu,
  MenuItem,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/04-components/actions/action/examples/lib";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <Action action={sleepLong}>
      <MenuItem>Herunterladen</MenuItem>
    </Action>
  </ContextMenu>
</ContextMenuTrigger>;
