import type { Meta, StoryObj } from "@storybook/react";
import Image from "../Image";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { LightBox, LightBoxTrigger } from "@/components/LightBox";
import { Button } from "@/components/Button";

const meta: Meta<typeof Image> = {
  title: "Content/Image",
  component: Image,
  render: (props) => <Image {...props} alt="Gopher" src={dummyText.imageSrc} />,
};
export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {};

export const WithBorder: Story = { args: { withBorder: true } };
