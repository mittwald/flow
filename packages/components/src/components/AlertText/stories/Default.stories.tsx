import type { Meta, StoryObj } from "@storybook/react";
import { AlertText } from "@/components/AlertText";
import { dummyText } from "@/lib/dev/dummyText";
import { Heading } from "@/components/Heading";
import { Avatar } from "@/components/Avatar";
import { Section } from "@/components/Section";
import { typedList } from "@/components/List";
import { Image } from "@/components/Image";
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
  },
  render: (props) => <AlertText {...props}>{dummyText.short}</AlertText>,
};

export default meta;

type Story = StoryObj<typeof AlertText>;

export const Default: Story = {};

export const InList: Story = {
  render: (props) => {
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
                  <AlertText {...props}>{dummyText.medium}</AlertText>
                </Text>
              </List.ItemView>
            )}
          </List.Item>
        </List.List>
      </Section>
    );
  },
};

export const InHeading: Story = {
  render: (props) => {
    return (
      <Heading>
        {dummyText.short} <AlertText {...props}>{dummyText.short}</AlertText>
      </Heading>
    );
  },
};
