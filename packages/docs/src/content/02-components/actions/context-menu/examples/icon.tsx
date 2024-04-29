import ContextMenu, {
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";
import MenuItem from "@mittwald/flow-react-components/MenuItem";
import { IconInfo } from "@mittwald/flow-react-components/Icons";
import Text from "@mittwald/flow-react-components/Text";

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
