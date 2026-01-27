import type { Meta, StoryObj } from "@storybook/react";
import {
  asyncFunction,
  asyncFunctionWithError,
  asyncLongFunction,
  button,
  syncFunction,
  syncFunctionWithError,
} from "@/components/Button/stories/lib";
import { Modal } from "@/components/Modal";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Action } from "@/components/Action";

const meta: Meta<typeof Action> = {
  title: "Actions/Action",
  component: Action,
  render: (props) => (
    <Action {...props}>
      <Button>Button</Button>
    </Action>
  ),
  parameters: {
    controls: {
      exclude: [
        "children",
        "action",
        "closeOverlay",
        "openOverlay",
        "toggleOverlay",
        "showFeedback",
        "break",
        "skip",
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Action>;

export const Default: Story = {};

export const Async: Story = {
  args: {
    onAction: asyncFunction,
  },
};

export const AsyncLong: Story = {
  args: {
    onAction: asyncLongFunction,
  },
};

export const AsyncWithFeedback: Story = {
  args: {
    onAction: asyncFunction,
    showFeedback: true,
  },
};

export const AsyncLongWithFeedback: Story = {
  args: {
    onAction: asyncLongFunction,
    showFeedback: true,
  },
};

export const Nested: Story = {
  args: {
    children: <Action onAction={syncFunction}>{button}</Action>,
  },
};

export const NestedAsync: Story = {
  args: {
    onAction: asyncFunction,
    children: <Action onAction={asyncFunction}>{button}</Action>,
  },
};

export const SyncError: Story = {
  args: {
    onAction: syncFunctionWithError,
  },
};

export const AsyncError: Story = {
  args: {
    onAction: asyncFunctionWithError,
  },
};

export const WithConfirmationModal: Story = {
  render: () => (
    <Action onAction={asyncLongFunction}>
      <Modal slot="actionConfirm">
        <Heading>Delete customer</Heading>
        <Content>Do you really want to delete the customer?</Content>
        <ActionGroup>
          <Button color="danger">Confirm</Button>
          <Button color="secondary" variant="soft">
            Abort
          </Button>
        </ActionGroup>
      </Modal>
      <Button color="secondary" variant="soft">
        Delete customer
      </Button>
    </Action>
  ),
};
