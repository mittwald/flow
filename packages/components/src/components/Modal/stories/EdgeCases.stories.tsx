import type { Meta, StoryObj } from "@storybook/react";
import Modal, { type ModalProps } from "../Modal";
import { useState } from "react";
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
import { Label } from "@/components/Label";

const meta: Meta<typeof Modal> = {
  ...defaultMeta,
  title: "Overlays/Modal/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const SizeChange: Story = {
  render: (props) => {
    const [size, setSize] = useState<ModalProps["size"]>("s");
    return (
      <Modal {...props} size={size} offCanvas isOpen>
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
          <Action closeModal>
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
