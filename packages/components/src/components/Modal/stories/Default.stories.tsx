import type { Meta, StoryObj } from "@storybook/react";
import Modal from "../Modal";
import React from "react";
import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import Label from "@/components/Label";
import Content from "@/components/Content";
import DialogTrigger from "@/components/DialogTrigger";
import Title from "@/components/Title";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,

  render: (props) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="accent" onPress={() => setOpen(true)}>
          Create customer
        </Button>
        <Modal {...props} isOpen={isOpen} onOpenChange={setOpen}>
          <Content>
            <Title>New Customer</Title>
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

export const WithState: Story = {};

export const WithDialogTrigger: Story = {
  render: (props) => (
    <DialogTrigger>
      <Button variant="danger">Delete project</Button>
      <Modal {...props}>
        {({ close }) => (
          <>
            <Content>
              <Title>Delete project</Title>
              <Text>Are you sure you want to delete this project?</Text>
            </Content>
            <ButtonGroup>
              <Button variant="secondary" onPress={close}>
                Abort
              </Button>
              <Button variant="danger" onPress={close}>
                Delete project
              </Button>
            </ButtonGroup>
          </>
        )}
      </Modal>
    </DialogTrigger>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Panel: Story = {
  args: { panel: true },
};
