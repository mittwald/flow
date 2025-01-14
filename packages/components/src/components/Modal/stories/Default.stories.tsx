import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Button from "~/components/Button";
import Text from "~/components/Text";
import TextField from "~/components/TextField";
import Label from "~/components/Label";
import Content from "~/components/Content";
import Heading from "~/components/Heading";
import Modal, { ModalTrigger } from "~/components/Modal";
import { useOverlayController } from "~/lib/controller/overlay/useOverlayController";
import { Action } from "~/components/Action";
import { ActionGroup } from "~/components/ActionGroup";
import { asyncLongFunction } from "~/components/Button/stories/lib";
import { Field, Form } from "~/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
import { Section } from "~/components/Section";

const meta: Meta<typeof Modal> = {
  title: "Overlays/Modal",
  component: Modal,
  parameters: {
    controls: { exclude: ["controller", "offCanvas"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m"],
    },
  },
  args: {
    size: "s",
  },
  render: (props) => {
    return (
      <Modal
        {...props}
        controller={useOverlayController("Modal", { isDefaultOpen: true })}
      >
        <Heading>New Customer</Heading>
        <Content>
          <Section>
            <Text>
              Create a new customer to manage your projects, members and
              payments.
            </Text>
            <TextField>
              <Label>Customer name</Label>
            </TextField>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Action action={asyncLongFunction}>
              <Button color="accent">Create customer</Button>
            </Action>
            <Button color="secondary" variant="soft">
              Abort
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const WithController: Story = {
  render: (props) => {
    const controller = useOverlayController("Modal", {
      onOpen: () => action("onOpen")(),
      onClose: () => action("onClose")(),
    });

    return (
      <>
        <Button color="primary" onPress={controller.open}>
          Create customer
        </Button>
        <Modal {...props} controller={controller}>
          <Heading>New Customer</Heading>
          <Content>
            <Text>
              Create a new customer to manage your projects, members and
              payments.
            </Text>
            <TextField>
              <Label>Customer name</Label>
            </TextField>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button color="accent">Create customer</Button>
              <Button color="secondary" variant="soft">
                Abort
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </>
    );
  },
};

export const WithTrigger: Story = {
  render: (props) => (
    <ModalTrigger>
      <Button color="danger">Delete project</Button>
      <Modal {...props}>
        <Heading>Delete project</Heading>
        <Content>
          <Text>Are you sure you want to delete this project?</Text>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Button color="danger">Delete project</Button>
            <Button variant="soft" color="secondary">
              Abort
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const OffCanvas: Story = {
  args: { offCanvas: true },
};

export const OffCanvasOrientationLeft: Story = {
  args: { offCanvas: true, offCanvasOrientation: "left" },
};

export const OffCanvasMobile: Story = {
  args: { offCanvas: true },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm<{ name: string }>();
    const modalController = useOverlayController("Modal");

    return (
      <>
        <Button color="accent" onPress={modalController.open}>
          Add customer
        </Button>

        <Modal {...props} controller={modalController}>
          <Form form={form} onSubmit={() => modalController.close()}>
            <Heading>Add Customer</Heading>
            <Content>
              <Field name="name" rules={{ required: "Please enter a name" }}>
                <TextField>
                  <Label>Customer name</Label>
                </TextField>
              </Field>
            </Content>
            <ActionGroup>
              <Button type="submit" color="accent">
                Submit
              </Button>
              <Action closeOverlay="Modal">
                <Button variant="soft" color="secondary">
                  Abort
                </Button>
              </Action>
            </ActionGroup>
          </Form>
        </Modal>
      </>
    );
  },
};

export const OffCanvasWithForm: Story = {
  render: (props) => {
    const form = useForm<{ name: string }>();
    const modalController = useOverlayController("Modal");

    return (
      <>
        <Button color="accent" onPress={modalController.open}>
          Add customer
        </Button>

        <Modal offCanvas {...props} controller={modalController}>
          <Form form={form} onSubmit={() => modalController.close()}>
            <Heading>Add Customer</Heading>
            <Content>
              <Field name="name" rules={{ required: "Please enter a name" }}>
                <TextField>
                  <Label>Customer name</Label>
                </TextField>
              </Field>
            </Content>
            <ActionGroup>
              <Button type="submit" color="accent">
                Submit
              </Button>
              <Action closeOverlay="Modal">
                <Button variant="soft" color="secondary">
                  Abort
                </Button>
              </Action>
            </ActionGroup>
          </Form>
        </Modal>
      </>
    );
  },
};
