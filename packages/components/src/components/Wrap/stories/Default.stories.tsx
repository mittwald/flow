import type { Meta, StoryObj } from "@storybook/react";
import Wrap from "../Wrap";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";

const meta: Meta<typeof Wrap> = {
  title: "Structure/Wrap",
  component: Wrap,
  args: {
    if: true,
  },
  argTypes: {
    if: { control: "boolean" },
  },
  parameters: {
    controls: { exclude: ["children"] },
  },
  render: (props) => (
    <Wrap if={props.if}>
      <Link href="#">
        <Text>Webshop Relaunch</Text>
      </Link>
    </Wrap>
  ),
};
export default meta;

type Story = StoryObj<typeof Wrap>;

export const Default: Story = {};

export const Unwrapped: Story = {
  args: { if: false },
};
