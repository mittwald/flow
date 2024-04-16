import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    onAction={(id) => {
      alert(id);
    }}
  >
    <ContextMenuItem id="1">Item 1</ContextMenuItem>
    <ContextMenuItem id="2">Item 2</ContextMenuItem>
    <ContextMenuItem id="3">Item 3</ContextMenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
