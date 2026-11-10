import type { Meta, StoryObj } from "@storybook/react";
import { ThemeScope } from "@/components/ThemeScope";
import { LayoutCard } from "@/components/LayoutCard";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Popover, PopoverTrigger } from "@/components/Popover";
import { Tooltip, TooltipTrigger } from "@/components/Tooltip";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Content } from "@/components/Content";
import { ActionGroup } from "@/components/ActionGroup";
import { Action } from "@/components/Action";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Area,
  CartesianChart,
  ChartGrid,
  XAxis,
  YAxis,
} from "@/components/CartesianChart";
import { dummyText } from "@/lib/dev/dummyText";

const chartData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 9 },
  { name: "Thu", value: 24 },
];

const ScopeContent = () => (
  <Section>
    <Heading>Theme scope</Heading>
    <Text>{dummyText.short}</Text>
    <TextField>
      <Label>Name</Label>
    </TextField>
    <ActionGroup>
      <PopoverTrigger>
        <Button>Popover</Button>
        <Popover>
          <Text>{dummyText.short}</Text>
        </Popover>
      </PopoverTrigger>
      <TooltipTrigger>
        <Button variant="soft" color="secondary">
          Tooltip
        </Button>
        <Tooltip>{dummyText.short}</Tooltip>
      </TooltipTrigger>
      <ModalTrigger>
        <Button variant="soft" color="secondary">
          Modal
        </Button>
        <Modal>
          <Heading>Modal</Heading>
          <Content>
            <Text>{dummyText.short}</Text>
          </Content>
          <ActionGroup>
            <Action closeOverlay="Modal">
              <Button>Close</Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    </ActionGroup>
    <LoadingSpinner />
    <CartesianChart data={chartData} height="160px">
      <ChartGrid />
      <XAxis dataKey="name" />
      <YAxis />
      <Area dataKey="value" />
    </CartesianChart>
  </Section>
);

const meta: Meta<typeof ThemeScope> = {
  title: "Structure/ThemeScope",
  component: ThemeScope,
  args: { theme: "dark" },
  argTypes: {
    theme: {
      control: "inline-radio",
      options: ["light", "dark", "system"],
    },
  },
  render: (props) => (
    <ThemeScope {...props}>
      <LayoutCard>
        <ScopeContent />
      </LayoutCard>
    </ThemeScope>
  ),
};
export default meta;

type Story = StoryObj<typeof ThemeScope>;

export const Default: Story = {};

export const Nested: Story = {
  render: (props) => (
    <ThemeScope {...props}>
      <LayoutCard>
        <Section>
          <Heading>Outer scope: {props.theme}</Heading>
          <ThemeScope theme={props.theme === "light" ? "dark" : "light"}>
            <LayoutCard>
              <ScopeContent />
            </LayoutCard>
          </ThemeScope>
        </Section>
      </LayoutCard>
    </ThemeScope>
  ),
};
