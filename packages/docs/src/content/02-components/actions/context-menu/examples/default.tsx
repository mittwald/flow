import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <ContextMenuItem>Item 1</ContextMenuItem>
    <ContextMenuItem>Item 2</ContextMenuItem>
    <ContextMenuItem>Item 3</ContextMenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
