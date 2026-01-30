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
import { ActionGroup } from "@/components/ActionGroup";
import { RadioButton, RadioGroup } from "@/components/RadioGroup";
import { Separator } from "@/components/Separator";
import { Link } from "@/components/Link";

const meta: Meta<typeof Flex> = {
  title: "Structure/Flex",
  component: Flex,

  render: () => (
    <LayoutCard style={{ height: 300 }}>
      <Section>
        <Text>{dummyText.medium}</Text>
      </Section>
      <Flex align="end" grow>
        <ActionGroup>
          <Button color="accent">Install</Button>
        </ActionGroup>
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

export const WithPadding: Story = {
  render: () => {
    return (
      <RadioGroup aria-label="tariffs">
        <RadioButton value="tariff1">
          <Flex
            direction="column"
            gap="s"
            align="center"
            paddingTop="m"
            paddingBottom="m"
            paddingRight="xl"
          >
            <Text align="center">
              <strong>Shared Webhosting</strong>
              <br />
              Webhosting
            </Text>
            <Text>
              Ab <strong>10 €</strong>
            </Text>
            <Separator />
            <Text>{dummyText.short}</Text>
            <Flex grow align="end" paddingTop="m">
              <Link href="#" target="_blank">
                Mehr erfahren
              </Link>
            </Flex>
          </Flex>
        </RadioButton>
        <RadioButton value="tariff2">
          <Flex
            direction="column"
            gap="s"
            align="center"
            paddingTop="m"
            paddingBottom="m"
            paddingRight="xl"
          >
            <Text align="center">
              <strong>Managed Cloud Hosting</strong>
              <br />
              vServer
            </Text>
            <Text>
              Ab <strong>32 €</strong>
            </Text>
            <Separator />
            <Text>{dummyText.medium}</Text>
            <Flex grow align="end" paddingTop="m">
              <Link href="#" target="_blank">
                Mehr erfahren
              </Link>
            </Flex>
          </Flex>
        </RadioButton>
      </RadioGroup>
    );
  },
};
