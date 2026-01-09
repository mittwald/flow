import type { Meta, StoryObj } from "@storybook/react";
import { AlertText } from "@/components/AlertText";
import { dummyText } from "@/lib/dev/dummyText";
import { typedList } from "@/components/List";
import Section from "@/components/Section";
import { Avatar } from "@/components/Avatar";
import Image from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

const meta: Meta<typeof AlertText> = {
  title: "Status/AlertText",
  component: AlertText,
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger", "unavailable"],
    },
  },
  args: {
    status: "info",
    children: dummyText.short,
  },
};

export default meta;

type Story = StoryObj<typeof AlertText>;

export const Info: Story = {
  args: { status: "info" },
};

export const Success: Story = {
  args: { status: "success" },
};

export const Warning: Story = {
  args: { status: "warning" },
};

export const Danger: Story = {
  args: { status: "danger" },
};

export const Unavailable: Story = {
  args: { status: "unavailable" },
};
export const InList: Story = {
  render: () => {
    const List = typedList<{ name: string }>();

    return (
      <Section>
        <List.List aria-label="Mitglieder">
          <List.StaticData data={[{ name: "John Doe" }]} />
          <List.Item showTiles textValue={(user) => user.name}>
            {(user) => (
              <List.ItemView>
                <Avatar>
                  <Image alt={user.name} src={dummyText.imageSrc} />
                </Avatar>
                <Heading>{user.name}</Heading>
                <Text>{dummyText.medium}</Text>
                <Text>
                  <AlertText>{dummyText.medium}</AlertText>
                </Text>
              </List.ItemView>
            )}
          </List.Item>
        </List.List>
      </Section>
    );
  },
};
