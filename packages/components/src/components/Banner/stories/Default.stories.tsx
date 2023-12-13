import type { Meta, StoryObj } from "@storybook/react";
import Banner from "../Banner";
import React from "react";

const meta: Meta<typeof Banner> = {
  title: "Banner",
  component: Banner,
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    children: <></>,
  },
};
