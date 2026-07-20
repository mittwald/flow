import type { Meta, StoryObj } from "@storybook/react";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { LabeledValue } from "@/components/LabeledValue";
import { Switch } from "@/components/Switch";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { AlertIcon } from "@/components/AlertIcon";
import { dummyText } from "@/lib/dev/dummyText";
import { useEffect, useState } from "react";
import type { Key } from "react-aria";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => {
    return (
      <Tabs {...props} disabledKeys={["spam"]}>
        <Tab id="general">
          <TabTitle>
            Comms
            <AlertIcon status="info" />
          </TabTitle>
          <Section>
            <Header>
              <Heading>Comms</Heading>
              <Button>Save</Button>
            </Header>
            <TextField defaultValue="luke.skywalker@rebellion.org">
              <Label>Holomail address</Label>
            </TextField>
          </Section>
        </Tab>
        <Tab id="storage">
          <TabTitle>Cargo hold</TabTitle>
          <Section>
            <Heading>Cargo hold</Heading>
            <LabeledValue>
              <Label>Available cargo</Label>
              <Text>2.4 GB</Text>
            </LabeledValue>
          </Section>
        </Tab>
        <Tab id="spam">
          <TabTitle>Spam</TabTitle>
          <Section>
            <Header>
              <Heading>Spam protection</Heading>
              <Switch>Spam protection</Switch>
            </Header>
            <Text>
              The spam filter protects you from unwanted transmissions. Nobody
              wants garbage in their inbox, so we recommend that you always
              leave spam protection activated.
            </Text>
          </Section>
        </Tab>
      </Tabs>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const Controlled: Story = {
  render: (props) => {
    const [selectedKey, setSelectedKey] = useState<Key>("general");

    return (
      <Tabs
        {...props}
        selectedKey={selectedKey}
        onSelectionChange={(key) => setSelectedKey(key)}
      >
        <Tab id="general">
          <TabTitle>Comms</TabTitle>
        </Tab>
        <Tab id="storage">
          <TabTitle>Cargo hold</TabTitle>
        </Tab>
      </Tabs>
    );
  },
};

export const WithLinks: Story = {
  render: (props) => {
    const [tab, setTab] = useState("general");

    useEffect(() => {
      const interval = setInterval(() => {
        setTab(window.location.hash.slice(1));
      }, 100);
      return () => clearInterval(interval);
    }, [setTab]);

    return (
      <Tabs {...props} selectedKey={tab}>
        <Tab id="general">
          <TabTitle href="#general">Comms</TabTitle>
        </Tab>
        <Tab id="storage">
          <TabTitle href="#storage">Cargo hold</TabTitle>
        </Tab>
      </Tabs>
    );
  },
};

export const Collapsed: Story = {
  render: (props) => (
    <Tabs {...props}>
      {Array(20)
        .fill("")
        .map((_, index) => (
          <Tab key={index}>
            <TabTitle>{dummyText.short}</TabTitle>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
          </Tab>
        ))}
    </Tabs>
  ),
};

export const TabNotFound: Story = {
  render: (props) => (
    <Tabs {...props} defaultSelectedKey="notFound">
      <Tab id="general">
        <TabTitle>Comms</TabTitle>
        <Section>
          <Heading>Comms</Heading>
        </Section>
      </Tab>

      <Tab id="storage">
        <TabTitle>Cargo hold</TabTitle>
        <Section>
          <Heading>Cargo hold</Heading>
        </Section>
      </Tab>
    </Tabs>
  ),
};
