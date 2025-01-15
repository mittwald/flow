import type { Meta, StoryObj } from "@storybook/react";
import Image from "../Image";
import React from "react";
import { dummyText } from "~/lib/dev/dummyText";

const meta: Meta<typeof Image> = {
  title: "Content/Image",
  component: Image,
  render: (props) => <Image {...props} alt="Gopher" src={dummyText.imageSrc} />,
};
export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {};
