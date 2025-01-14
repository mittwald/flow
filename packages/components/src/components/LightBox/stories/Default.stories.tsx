import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Button from "~/components/Button";
import { ActionGroup } from "~/components/ActionGroup";
import { LightBox } from "~/components/LightBox";
import LightBoxTrigger from "~/components/LightBox/components/LightBoxTrigger";
import { Image } from "~/components/Image";
import { dummyText } from "~/lib/dev/dummyText";
import { IconDelete, IconDownload } from "~/components/Icon/components/icons";
import { useOverlayController } from "~/lib/controller";

const meta: Meta<typeof LightBox> = {
  title: "Overlays/LightBox",
  component: LightBox,
  parameters: {
    controls: { exclude: ["controller"] },
  },
  render: (props) => {
    return (
      <LightBoxTrigger>
        <Button>Open LightBox</Button>
        <LightBox {...props}>
          <Image src={dummyText.imageSrc} />
          <ActionGroup>
            <Button>
              <IconDownload />
            </Button>
            <Button>
              <IconDelete />
            </Button>
          </ActionGroup>
        </LightBox>
      </LightBoxTrigger>
    );
  },
};
export default meta;

type Story = StoryObj<typeof LightBox>;

export const Default: Story = {};

export const WithoutFitScreen: Story = { args: { fitScreen: false } };

export const WithController: Story = {
  render: (props) => {
    const controller = useOverlayController("LightBox");

    return (
      <>
        <Button onPress={controller.open}>Open LightBox</Button>
        <LightBox {...props} controller={controller}>
          <Image src={dummyText.imageSrc} />
          <ActionGroup>
            <Button>
              <IconDownload />
            </Button>
            <Button>
              <IconDelete />
            </Button>
          </ActionGroup>
        </LightBox>
      </>
    );
  },
};
