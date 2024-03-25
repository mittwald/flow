import type { Meta, StoryObj } from "@storybook/react";
import ButtonGroup from "../ButtonGroup";
import React from "react";
import { Button } from "@/components/Button";

const meta: Meta<typeof ButtonGroup> = {
  title: "Actions/ButtonGroup",
  component: ButtonGroup,
  render: (props) => (
    <ButtonGroup {...props}>
      <Button variant="accent">Create customer</Button>
      <Button style="soft" variant="secondary">
        Abort
      </Button>
    </ButtonGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button variant="danger">Delete project</Button>
      <Button style="soft" variant="secondary">
        Abort
      </Button>
    </ButtonGroup>
  ),
};

export const Info: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button>Ok</Button>
    </ButtonGroup>
  ),
};

export const AdditionalSecondary: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button variant="accent">Add email address</Button>
      <Button style="soft" variant="secondary">
        Save and add more
      </Button>
      <Button style="soft" variant="secondary">
        Abort
      </Button>
    </ButtonGroup>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
