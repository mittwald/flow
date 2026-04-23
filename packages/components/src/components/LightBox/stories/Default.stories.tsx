import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Button from "@/components/Button";
import { ActionGroup } from "@/components/ActionGroup";
import { Gallery, GalleryItem, LightBox } from "@/components/LightBox";
import LightBoxTrigger from "@/components/LightBox/components/LightBoxTrigger";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import { IconDelete, IconDownload } from "@/components/Icon/components/icons";
import { useOverlayController } from "@/lib/controller";
import svg from "./test.svg";
import { Flex } from "@/components/Flex";

const images = [
  dummyText.imageSrc,
  "https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg",
  svg,
];

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

export const WithImageTrigger: Story = {
  render: () => (
    <LightBoxTrigger>
      <Button>
        <Image width={100} withBorder alt="Gopher" src={dummyText.imageSrc} />
      </Button>
      <LightBox>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </LightBox>
    </LightBoxTrigger>
  ),
};

export const WithSvg: Story = {
  render: () => (
    <LightBoxTrigger>
      <Button>
        <Image withBorder alt="Gopher" src={svg} />
      </Button>
      <LightBox>
        <Image alt="Gopher" src={svg} />
      </LightBox>
    </LightBoxTrigger>
  ),
};

export const WithGallery: Story = {
  render: () => (
    <Flex gap="m" wrap="wrap">
      {images.map((src, index) => (
        <LightBoxTrigger key={index}>
          <Button>
            <Image alt="" src={src} height="100px" withBorder />
          </Button>
          <LightBox>
            <Gallery defaultIndex={index}>
              {images.map((src) => (
                <GalleryItem>
                  <Image src={src} />
                  <ActionGroup>
                    <Button>
                      <IconDownload />
                    </Button>
                  </ActionGroup>
                </GalleryItem>
              ))}
            </Gallery>
          </LightBox>
        </LightBoxTrigger>
      ))}
    </Flex>
  ),
};
