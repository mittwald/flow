"use client";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu onAction={(item) => console.log(item)}>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  );
}
