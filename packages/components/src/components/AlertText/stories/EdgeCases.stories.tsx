import type { Meta, StoryObj } from "@storybook/react";
import { AlertText } from "@/components/AlertText";
import { dummyText } from "@/lib/dev/dummyText";
import { typedList } from "@/components/List";
import Section from "@/components/Section";
import { Avatar } from "@/components/Avatar";
import Image from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import defaultMeta from "@/components/AccentBox/stories/Default.stories";

const meta: Meta<typeof AlertText> = {
  ...defaultMeta,
  title: "Status/AlertText/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof AlertText>;

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
