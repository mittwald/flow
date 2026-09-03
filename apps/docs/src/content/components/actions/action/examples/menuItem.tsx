import {
  Action,
  Button,
  ContextMenuTrigger,
  ContextMenu,
  MenuItem,
} from "@mittwald/flow-react-components";
import { sleepLong } from "@/content/components/actions/action/examples/lib";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <Action onAction={sleepLong}>
      <MenuItem>Herunterladen</MenuItem>
    </Action>
  </ContextMenu>
</ContextMenuTrigger>;
