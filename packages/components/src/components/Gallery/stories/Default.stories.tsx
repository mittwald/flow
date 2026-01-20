import type { Meta, StoryObj } from "@storybook/react";
import { Gallery, GalleryItem } from "@/components/Gallery";
import { dummyText } from "@/lib/dev/dummyText";
import Image from "@/components/Image";
import React from "react";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { IconDelete, IconDownload } from "@/components/Icon/components/icons";
import { LightBox, LightBoxTrigger } from "@/components/LightBox";
import { Flex } from "@/components/Flex";

const images = [
  dummyText.imageSrc,
  "https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg",
];

const meta: Meta<typeof Gallery> = {
  title: "Content/Gallery",
  component: Gallery,
  render: () => (
    <LightBoxTrigger>
      <Button>Trigger LightBox</Button>
      <LightBox>
        <Gallery>
          {images.map((src) => (
            <GalleryItem>
              <Image alt="" src={src} />
              <ActionGroup>
                <Button>
                  <IconDownload />
                </Button>
                <Button>
                  <IconDelete />
                </Button>
              </ActionGroup>
            </GalleryItem>
          ))}
        </Gallery>
      </LightBox>
    </LightBoxTrigger>
  ),
};

export default meta;

type Story = StoryObj<typeof Gallery>;

export const Default: Story = {};

export const WithoutActions: Story = {
  render: () => (
    <LightBoxTrigger>
      <Button>Trigger LightBox</Button>
      <LightBox>
        <Gallery>
          <GalleryItem>
            <Image alt="Gopher" src={dummyText.imageSrc} />
          </GalleryItem>
          {images.map((src) => (
            <GalleryItem>
              <Image alt="" src={src} />
            </GalleryItem>
          ))}
        </Gallery>
      </LightBox>
    </LightBoxTrigger>
  ),
};

export const WithImageTriggers: Story = {
  render: () => (
    <Flex gap="m">
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
                </GalleryItem>
              ))}
            </Gallery>
          </LightBox>
        </LightBoxTrigger>
      ))}
    </Flex>
  ),
};
