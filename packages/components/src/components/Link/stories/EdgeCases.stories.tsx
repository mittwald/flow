import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import React from "react";
import { Icon } from "@/components/Icon";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons/faExternalLink";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Link> = {
  ...defaultMeta,
  title: "Navigation/Link/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Link>;

export const LongText: Story = {
  render: (props) => (
    <Link {...props}>
      {dummyText.medium}
      <Icon faIcon={faExternalLink} aria-label="external link" />
    </Link>
  ),
};
