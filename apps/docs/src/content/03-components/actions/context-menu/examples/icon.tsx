import {
  ContextMenu,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { MenuItem } from "@mittwald/flow-react-components";
import { IconInfo } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu
    onAction={(id) => {
      alert(id);
    }}
  >
    <MenuItem id="1">
      <IconInfo />
      <Text>Item 1</Text>
    </MenuItem>
    <MenuItem id="2">
      <IconInfo />
      <Text>Item 2</Text>
    </MenuItem>
    <MenuItem id="3">
      <IconInfo />
      <Text>Item 3</Text>
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
