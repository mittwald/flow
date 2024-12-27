import ContextMenu, {
  ContextMenuSection,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import { Button } from "@mittwald/flow-react-components/Button";
import { Separator } from "@mittwald/flow-react-components/Separator";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <ContextMenuSection selectionMode="multiple">
      <MenuItem id="item1">Item 1</MenuItem>
      <MenuItem id="item2">Item 2</MenuItem>
      <MenuItem id="item3">Item 3</MenuItem>
    </ContextMenuSection>
    <Separator />
    <ContextMenuSection selectionMode="single">
      <MenuItem id="item1">Item 4</MenuItem>
      <MenuItem id="item2">Item 5</MenuItem>
      <MenuItem id="item3">Item 6</MenuItem>
    </ContextMenuSection>
  </ContextMenu>
</ContextMenuTrigger>;
