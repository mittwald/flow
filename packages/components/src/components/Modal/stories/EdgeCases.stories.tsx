import type { Meta, StoryObj } from "@storybook/react";
import Modal, { type ModalProps } from "../Modal";
import React, { useState } from "react";
import { Button } from "@/components/Button";
import defaultMeta from "./Default.stories";
import { Content } from "@/components/Content";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { ActionGroup } from "@/components/ActionGroup";
import { TextField } from "@/components/TextField";
import { dummyText } from "@/lib/dev/dummyText";
import Heading from "@/components/Heading";
import { Action } from "@/components/Action";
import { useOverlayController } from "@/lib/controller";
import { Label } from "@/components/Label";

const meta: Meta<typeof Modal> = {
  ...defaultMeta,
  title: "Overlays/Modal/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const LongContent: Story = {
  render: (props) => (
    <Modal
      {...props}
      controller={useOverlayController("Modal", { isDefaultOpen: true })}
    >
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
      <ActionGroup>
        <Action closeOverlay="Modal">
          <Button color="accent">Create customer</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  ),
};

export const LongContentOffCanvas: Story = {
  render: (props) => (
    <Modal
      offCanvas
      {...props}
      controller={useOverlayController("Modal", { isDefaultOpen: true })}
    >
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
      <ActionGroup>
        <Action closeOverlay="Modal">
          <Button color="accent">Create customer</Button>
          <Button variant="soft" color="secondary">
            Abort
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  ),
};

export const SizeChange: Story = {
  render: (props) => {
    const [size, setSize] = useState<ModalProps["size"]>("s");
    return (
      <Modal
        {...props}
        size={size}
        offCanvas
        controller={useOverlayController("Modal", { isDefaultOpen: true })}
      >
        <Heading>{dummyText.short}</Heading>
        <Content>
          <Section>
            {size === "s" && <Text>{dummyText.long}</Text>}
            {size === "m" && (
              <TextField>
                <Label>{dummyText.short}</Label>
              </TextField>
            )}

            <Button onPress={() => setSize(size === "s" ? "m" : "s")}>
              Change size
            </Button>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Button color="accent">Create customer</Button>
            <Button variant="soft" color="secondary">
              Abort
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    );
  },
};
