import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-remote-react-components";

export const standard = () => (
  <ContextMenuTrigger>
    <Button data-testid="trigger">Click me</Button>
    <ContextMenu>
      <MenuItem data-testid="menu-item">Foo</MenuItem>
      <MenuItem>Bar</MenuItem>
      <MenuItem>Baz</MenuItem>
    </ContextMenu>
  </ContextMenuTrigger>
);
