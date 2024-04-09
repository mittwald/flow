import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import { Button } from "@mittwald/flow-react-components/Button";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    selectionMode="multiple"
    defaultSelectedKeys={["item2", "item3"]}
  >
    <ContextMenuItem id="item1">Item 1</ContextMenuItem>
    <ContextMenuItem id="item2">Item 2</ContextMenuItem>
    <ContextMenuItem id="item3">Item 3</ContextMenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
