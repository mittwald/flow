import type { Meta, StoryObj } from "@storybook/react";
import Modal from "../Modal";
import React from "react";
import { Button } from "@/components/Button";
import defaultMeta from "./Default.stories";
import { Content } from "@/components/Content";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { ButtonGroup } from "@/components/ButtonGroup";
import { dummyText } from "@/lib/dev/dummyText";
import Heading from "@/components/Heading";

const meta: Meta<typeof Modal> = {
  ...defaultMeta,
  title: "Overlays/Modal/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const LongContent: Story = {
  render: (props) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="accent" onPress={() => setOpen(true)}>
          Create customer
        </Button>
        <Modal {...props} isOpen={isOpen} onOpenChange={setOpen}>
          <Heading>{dummyText.short}</Heading>
          <Content>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
          </Content>
          <ButtonGroup>
            <Button variant="accent" onPress={() => setOpen(false)}>
              Create customer
            </Button>
            <Button
              style="soft"
              variant="secondary"
              onPress={() => setOpen(false)}
            >
              Abort
            </Button>
          </ButtonGroup>
        </Modal>
      </>
    );
  },
};
