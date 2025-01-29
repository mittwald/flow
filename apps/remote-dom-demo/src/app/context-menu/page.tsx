"use client";
import { IconApp } from "@mittwald/flow-remote-react-components/Icons";
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
  Text,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <ContextMenuTrigger>
      <Button>Open menu</Button>
      <ContextMenu onAction={(item) => console.log(item)}>
        <MenuItem>
          <IconApp />
          <Text>Test</Text>
        </MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
        <MenuItem>Test</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  );
}
