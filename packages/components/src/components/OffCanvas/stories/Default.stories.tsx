import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { OffCanvas } from "@/components/OffCanvas";
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
import { OverlayTrigger } from "@/components/Overlay";
import { Heading } from "@/components/Heading";

const meta: Meta<typeof OffCanvas> = {
  title: "Overlays/OffCanvas",
  component: OffCanvas,
  parameters: {
    controls: { exclude: ["controller", "className"] },
  },

  render: (props) => {
    return (
      <OverlayTrigger>
        <Button>
          <IconMenu />
        </Button>
        <OffCanvas {...props}>
          <Heading>Menu</Heading>
          <Navigation aria-label="Main menu">
            <Action closeOverlay>
              <Link>
                <IconCustomer />
                <Text>Customer</Text>
              </Link>
            </Action>
            <Action closeOverlay>
              <Link aria-current="page">
                <IconServer />
                <Text>Server</Text>
              </Link>
            </Action>
            <Action closeOverlay>
              <Link>
                <IconProject />
                <Text>Project</Text>
              </Link>
            </Action>
          </Navigation>
        </OffCanvas>
      </OverlayTrigger>
    );
  },
};
export default meta;

type Story = StoryObj<typeof OffCanvas>;

export const Default: Story = {};
