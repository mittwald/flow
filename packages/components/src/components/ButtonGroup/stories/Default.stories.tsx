import type { Meta, StoryObj } from "@storybook/react";
import ButtonGroup from "../ButtonGroup";
import React from "react";
import { Button } from "@/components/Button";

const meta: Meta<typeof ButtonGroup> = {
  title: "Buttons/ButtonGroup",
  component: ButtonGroup,
  render: (props) => (
    <ButtonGroup {...props}>
      <Button style="soft" variant="secondary">
        Abort
      </Button>
      <Button variant="accent">Create customer</Button>
    </ButtonGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button style="soft" variant="secondary">
        Abort
      </Button>
      <Button variant="danger">Delete project</Button>
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
      <Button style="soft" variant="secondary">
        Abort
      </Button>
      <Button style="soft" variant="secondary">
        Save and add more
      </Button>
      <Button variant="accent">Add email address</Button>
    </ButtonGroup>
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
