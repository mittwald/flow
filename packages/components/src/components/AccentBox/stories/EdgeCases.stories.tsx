import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import defaultMeta from "./Default.stories";
import { Heading } from "@/components/Heading";
import { dummyText } from "@/lib/dev/dummyText";
import { AccentBox } from "@/components/AccentBox";
import { IconStar } from "@/components/Icon/components/icons";
import Button from "@/components/Button";
import Align from "@/components/Align";
import ContextualHelp, {
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import Alert from "@/components/Alert";
import CopyButton from "@/components/CopyButton";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";

const meta: Meta<typeof AccentBox> = {
  ...defaultMeta,
  title: "Structure/AccentBox/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof AccentBox>;

export const WithVariousContent: Story = {
  args: { color: "green" },
  render: (props) => (
    <AccentBox {...props}>
      <IconStar />
      <Section>
        <Heading>Heading</Heading>
        <Text>{dummyText.long}</Text>
        <Button>Button</Button>
        <Align>
          <Text>{dummyText.short}</Text>
          <ContextualHelpTrigger>
            <Button />
            <ContextualHelp>
              <Heading>Contextual Help</Heading>
              <Text>{dummyText.short}</Text>
            </ContextualHelp>
          </ContextualHelpTrigger>
        </Align>
        <Alert status="warning">
          <Heading>Alert Heading</Heading>
          <Text>This is an alert inside an AccentBox.</Text>
        </Alert>
        <Align>
          <Text>{dummyText.short}</Text>
          <CopyButton />
        </Align>
      </Section>
    </AccentBox>
  ),
};
