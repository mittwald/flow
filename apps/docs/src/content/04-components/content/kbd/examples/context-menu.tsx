import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
  Kbd,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Menü öffnen</Button>
  <ContextMenu>
    <MenuItem>
      Speichern <Kbd keys={["mod", "s"]} />
    </MenuItem>
    <MenuItem>
      Kopieren <Kbd keys={["mod", "c"]} />
    </MenuItem>
    <MenuItem>
      Einfügen <Kbd keys={["mod", "v"]} />
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
