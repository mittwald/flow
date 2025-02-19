import {
  Button,
  ContextMenu,
  ContextMenuSection,
  ContextMenuTrigger,
  Heading,
  MenuItem,
  Separator,
} from "@mittwald/flow-react-components";

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
