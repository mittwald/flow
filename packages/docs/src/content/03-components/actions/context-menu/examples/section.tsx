import ContextMenu, {
  ContextMenuSection,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";
import MenuItem from "@mittwald/flow-react-components/MenuItem";
import Heading from "@mittwald/flow-react-components/Heading";
import Separator from "@mittwald/flow-react-components/Separator";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <ContextMenuSection>
      <Heading>Section 1</Heading>
      <MenuItem id="1">Item 1</MenuItem>
      <MenuItem id="2">Item 2</MenuItem>
      <MenuItem id="3">Item 3</MenuItem>
    </ContextMenuSection>
    <Separator />
    <ContextMenuSection>
      <Heading>Section 2</Heading>
      <MenuItem id="4">Item 4</MenuItem>
      <MenuItem id="5">Item 5</MenuItem>
    </ContextMenuSection>
  </ContextMenu>
</ContextMenuTrigger>;
