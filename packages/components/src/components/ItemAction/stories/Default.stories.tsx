import type { Meta, StoryObj } from "@storybook/react";
import { ItemAction } from "@/components/ItemAction";
import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { IconDelete } from "@/components/Icon/components/icons";

const chats = [
  { id: "chat1", title: "Planning the hyperdrive upgrade" },
  { id: "chat2", title: "Cloaking device troubleshooting" },
  { id: "chat3", title: "Crew schedule" },
];

const meta: Meta<typeof ItemAction> = {
  title: "Actions/ItemAction",
  component: ItemAction,
  args: {
    visibility: "hover",
  },
  argTypes: {
    visibility: {
      control: "inline-radio",
      options: ["hover", "always"],
    },
  },
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu defaultOpen>
        {chats.map((chat) => (
          <MenuItem key={chat.id} id={chat.id}>
            <Text>{chat.title}</Text>
            <ItemAction {...props} aria-label={`Delete ${chat.title}`}>
              <IconDelete />
            </ItemAction>
          </MenuItem>
        ))}
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof ItemAction>;

export const Default: Story = {};

export const AlwaysVisible: Story = {
  args: {
    visibility: "always",
  },
};
