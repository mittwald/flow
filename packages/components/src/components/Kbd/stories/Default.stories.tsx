import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Kbd } from "@/components/Kbd";

const meta: Meta<typeof Kbd> = {
  title: "Content/Kbd",
  component: Kbd,
  render: (props) => (
    <Kbd {...props} keys={["mod", "k"]}>
      mod + k
    </Kbd>
  ),
  args: {
    isDisabled: false,
    variant: "plain",
  },
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    variant: { control: "inline-radio", options: ["plain", "soft"] },
  },
  parameters: {
    controls: { exclude: ["keys", "children"] },
  },
};
export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {};

export const WithChildren: Story = {
  args: {
    keys: undefined,
    children: (
      <Kbd>
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>, <Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>
      </Kbd>
    ),
  },
  render: (props) => (
    <Kbd {...props}>
      <Kbd keys={["mod"]} /> + <Kbd keys={["k"]} />, <Kbd keys={["mod"]} /> +{" "}
      <Kbd keys={["c"]} />
    </Kbd>
  ),
};
