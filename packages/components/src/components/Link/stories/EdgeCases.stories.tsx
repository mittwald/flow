import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { IconExternalLink } from "@/components/Icon/components/icons";

const meta: Meta<typeof Link> = {
  ...defaultMeta,
  title: "Navigation/Link/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Link>;

export const LongText: Story = {
  render: (props) => (
    <Link {...props}>
      {dummyText.long}
      <IconExternalLink aria-label="external link" />
    </Link>
  ),
};
