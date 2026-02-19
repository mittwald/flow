import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Flex } from "@/components/Flex";
import { LayoutCard } from "@/components/LayoutCard";
import { BigNumber } from "@/components/BigNumber";

const meta: Meta<typeof Flex> = {
  title: "Structure/Flex",
  component: Flex,
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["row", "row-reverse", "column", "column-reverse"],
    },
    align: {
      control: "inline-radio",
      options: ["start", "end", "center", "stretch", "baseline"],
    },
    justify: {
      control: "inline-radio",
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ],
    },
    grow: { control: "boolean" },
    gap: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    columnGap: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    rowGap: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    wrap: {
      control: "inline-radio",
      options: ["nowrap", "wrap", "wrap-reverse"],
    },
    padding: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    paddingTop: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    paddingBottom: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    paddingLeft: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
    paddingRight: {
      control: "inline-radio",
      options: ["xs", "s", "m", "l", "xl"],
    },
  },
  args: { grow: false, direction: "row", gap: "xl" },
  render: (props) => (
    <Flex {...props}>
      <LayoutCard>
        <BigNumber>1</BigNumber>
      </LayoutCard>
      <LayoutCard>
        <BigNumber>2</BigNumber>
      </LayoutCard>
      <LayoutCard>
        <BigNumber>3</BigNumber>
      </LayoutCard>
    </Flex>
  ),
};
export default meta;

type Story = StoryObj<typeof Flex>;

export const Default: Story = {};
