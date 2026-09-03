import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  IconDelete,
  IconDomain,
  IconInfo,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    onAction={(id) => {
      alert(id);
    }}
  >
    <MenuItem id="details">
      <IconInfo />
      <Text>Details anzeigen</Text>
    </MenuItem>
    <MenuItem id="open">
      <IconDomain />
      <Text>Im Browser öffnen</Text>
    </MenuItem>
    <MenuItem id="delete">
      <IconDelete />
      <Text>Löschen</Text>
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
