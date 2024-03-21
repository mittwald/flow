import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import Label from "@/components/Label";
import Content from "@/components/Content";
import Title from "@/components/Title";
import Modal, { ModalTrigger } from "@/components/Modal";

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
            <Button variant="accent" onPress={() => setOpen(false)}>
              Create customer
            </Button>
            <Button
              variant="secondary"
              style="soft"
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
export default meta;

type Story = StoryObj<typeof Modal>;

export const WithState: Story = {};

export const WithDialogTrigger: Story = {
  render: (props) => (
    <ModalTrigger>
      <Button variant="danger">Delete project</Button>
      <Modal {...props}>
        {({ close }) => (
          <>
            <Content>
              <Title>Delete project</Title>
              <Text>Are you sure you want to delete this project?</Text>
            </Content>
            <ButtonGroup>
              <Button variant="danger" onPress={close}>
                Delete project
              </Button>
              <Button style="soft" variant="secondary" onPress={close}>
                Abort
              </Button>
            </ButtonGroup>
          </>
        )}
      </Modal>
    </ModalTrigger>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const Panel: Story = {
  args: { panel: true },
};
