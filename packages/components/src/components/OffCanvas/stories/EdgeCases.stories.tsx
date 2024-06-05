import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { OffCanvas, OffCanvasTrigger } from "@/components/OffCanvas";
import { Button } from "@/components/Button";
import { IconMenu } from "@/components/Icon/components/icons";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";

const meta: Meta<typeof OffCanvas> = {
  ...defaultMeta,
  title: "Overlays/OffCanvas/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof OffCanvas>;

export const LongTexts: Story = {
  render: (props) => {
    return (
      <OffCanvasTrigger>
        <Button>
          <IconMenu />
        </Button>
        <OffCanvas {...props}>
          <Heading>{dummyText.long}</Heading>
          <Section>{dummyText.long}</Section>
          <Section>{dummyText.long}</Section>
          <Section>{dummyText.long}</Section>
          <Section>{dummyText.long}</Section>
          <Section>{dummyText.long}</Section>
          <Section>{dummyText.long}</Section>
          <Section>{dummyText.long}</Section>
        </OffCanvas>
      </OffCanvasTrigger>
    );
  },
};
