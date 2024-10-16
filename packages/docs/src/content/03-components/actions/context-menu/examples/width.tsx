import ContextMenu, { ContextMenuTrigger } from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";
import MenuItem from "@mittwald/flow-react-components/MenuItem";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    width={300}
    onAction={(id) => {
      alert(id);
    }}
  >
    <MenuItem id="1">Mein Projekt</MenuItem>
    <MenuItem id="2">Mein zweites Projekt</MenuItem>
    <MenuItem id="3">
      Mein drittes Projekt mit einem sehr langen Namen
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;


