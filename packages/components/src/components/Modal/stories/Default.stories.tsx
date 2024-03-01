import type { Meta, StoryObj } from "@storybook/react";
import Modal from "../Modal";
import React from "react";
import { Button } from "@/components/Button";
import { ButtonGroup } from "@/components/ButtonGroup";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,

  render: (props) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
      <>
        <Button onPress={() => setOpen(true)}>Show modal</Button>
        <Modal {...props} isOpen={isOpen} onOpenChange={setOpen}>
          <Content>
            <Heading>New Customer</Heading>
            <Text>
              Create a new customer to manage your projects, members and
              payments.
            </Text>
            <TextField>
              <Label>Customer name</Label>
            </TextField>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={() => setOpen(false)}>
              Abort
            </Button>
            <Button variant="accent" onPress={() => setOpen(false)}>
              Create customer
            </Button>
          </ButtonGroup>
        </Modal>
      </>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};
