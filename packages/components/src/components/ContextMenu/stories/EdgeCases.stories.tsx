import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import type { PressEvent } from "@react-types/shared";

const meta: Meta<typeof ContextMenu> = {
  ...defaultMeta,
  title: "Actions/ContextMenu/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const LongTexts: Story = {
  args: { width: 400 },
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem>{dummyText.medium}</MenuItem>
        <MenuItem>{dummyText.medium}</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};

export const LongList: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        {Array(20)
          .fill("")
          .map((value, index) => (
            <MenuItem key={index}>Item {index + 1}</MenuItem>
          ))}
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};

export const ModifierKeys: Story = {
  args: { width: 400 },
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem onAction={() => alert("Action")}>Action</MenuItem>
        <MenuItem
          // @ts-expect-error
          onPress={(event: PressEvent) => {
            switch (true) {
              case event.shiftKey:
                alert("Press with Shift");
                break;
              case event.altKey:
                alert("Press with Alt");
                break;
              case event.ctrlKey:
                alert("Press with Ctrl");
                break;
              case event.metaKey:
                alert("Press with Meta");
                break;
              default:
                alert("Press");
            }
          }}
        >
          Press
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
