import {
  ContextMenu,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { MenuItem } from "@mittwald/flow-react-components";
import { Separator } from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <MenuItem id="1">Item 1</MenuItem>
    <Separator />
    <MenuItem id="2">Item 2</MenuItem>
    <MenuItem id="3">Item 3</MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
