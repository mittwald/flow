import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OffCanvas, OffCanvasTrigger } from "@/components/OffCanvas";
import { Button } from "@/components/Button";
import {
  IconCustomer,
  IconMenu,
  IconProject,
  IconServer,
} from "@/components/Icon/components/icons";
import { Link } from "@/components/Link";
import { Text } from "@/components/Text";
import { Navigation } from "@/components/Navigation";
import { Action } from "@/components/Action";
import { Heading } from "@/components/Heading";

const meta: Meta<typeof OffCanvas> = {
  title: "Overlays/OffCanvas",
  component: OffCanvas,
  parameters: {
    controls: { exclude: ["controller", "className"] },
  },

  render: (props) => {
    return (
      <OffCanvasTrigger>
        <Button>
          <IconMenu />
        </Button>
        <OffCanvas {...props}>
          <Heading>Menu</Heading>
          <Action closeOverlay="OffCanvas">
            <Navigation aria-label="Main menu">
              <Link>
                <IconCustomer />
                <Text>Customer</Text>
              </Link>
              <Link aria-current="page">
                <IconServer />
                <Text>Server</Text>
              </Link>
              <Link>
                <IconProject />
                <Text>Project</Text>
              </Link>
            </Navigation>
          </Action>
        </OffCanvas>
      </OffCanvasTrigger>
    );
  },
};
export default meta;

type Story = StoryObj<typeof OffCanvas>;

export const Default: Story = {};
