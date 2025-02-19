import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    selectionMode="single"
    defaultSelectedKeys={["item2"]}
  >
    <MenuItem id="item1">Item 1</MenuItem>
    <MenuItem id="item2">Item 2</MenuItem>
    <MenuItem id="item3">Item 3</MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
