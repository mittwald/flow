import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
  ShortcutKey,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Menü öffnen</Button>
  <ContextMenu>
    <MenuItem>
      Speichern <ShortcutKey keys={["mod", "s"]} />
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
