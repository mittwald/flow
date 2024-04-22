import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import defaultMeta from "./Default.stories";
import {
  asyncFunction,
  syncfunction,
  button,
} from "@/components/Button/stories/lib";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Accordion> = {
  ...defaultMeta,
  title: "Structure/Accordion/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const LongHeading: Story = {
  render: (props) => (
    <Accordion {...props}>
      <Heading>{dummyText.medium}</Heading>
      <Content>{dummyText.long}</Content>
    </Accordion>
  ),
};
