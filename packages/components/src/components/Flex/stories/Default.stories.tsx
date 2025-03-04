import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Flex } from "@/components/Flex";
import { LayoutCard } from "@/components/LayoutCard";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { Button } from "@/components/Button";
import { typedList } from "@/components/List";
import { Avatar } from "@/components/Avatar";
import Image from "@/components/Image";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";

const meta: Meta<typeof Flex> = {
  title: "Structure/Flex",
  component: Flex,

  render: () => (
    <LayoutCard style={{ height: 300 }}>
      <Section>
        <Text>{dummyText.medium}</Text>
      </Section>
      <Flex justify="end" align="end" grow>
        <Button color="accent">Install</Button>
      </Flex>
    </LayoutCard>
  ),
};
export default meta;

type Story = StoryObj<typeof Flex>;

export const Default: Story = {};

export const ListItemContent: Story = {
  render: () => {
    const List = typedList<{ text: string }>();

    return (
      <List.List defaultViewMode="tiles">
        <List.StaticData
          data={[
            { text: dummyText.short },
            { text: `${dummyText.short} ${dummyText.short}` },
          ]}
        />
        <List.Item showTiles showList={false} textValue={(i) => i.text}>
          {(i) => (
            <List.ItemView>
              <Avatar>
                <Image alt="" src={dummyText.imageSrc} />
              </Avatar>
              <Heading>{i.text}</Heading>

              <Content>
                <Flex justify="end" align="end" grow>
                  Free
                </Flex>
              </Content>
            </List.ItemView>
          )}
        </List.Item>
      </List.List>
    );
  },
};
