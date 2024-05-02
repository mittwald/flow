import ContextMenu, {
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";
import MenuItem from "@mittwald/flow-react-components/MenuItem";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    onAction={(id) => {
      alert(id);
    }}
  >
    <MenuItem id="1">Item 1</MenuItem>
    <MenuItem id="2">Item 2</MenuItem>
    <MenuItem id="3">Item 3</MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
