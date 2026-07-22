import type { Meta, StoryObj } from "@storybook/react";
import { AlertIcon } from "@/components/AlertIcon";
import { TabNavigation } from "@/components/TabNavigation";
import { Link } from "@/components/Link";

const meta: Meta<typeof TabNavigation> = {
  title: "Navigation/TabNavigation",
  component: TabNavigation,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => (
    <TabNavigation aria-label="Project navigation" {...props}>
      <Link href="#">Apps</Link>
      <Link href="#" aria-current="page">
        Container
      </Link>
      <Link href="#">Domains</Link>
      <Link href="#">E-Mails</Link>
      <Link href="#">
        Databases
        <AlertIcon status="warning" />
      </Link>
      <Link href="#">Backups</Link>
    </TabNavigation>
  ),
};

export default meta;

type Story = StoryObj<typeof TabNavigation>;

export const Default: Story = {};
