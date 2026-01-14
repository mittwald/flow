import type { Meta, StoryObj } from "@storybook/react";
import { Gallery, GalleryItem } from "@/components/Gallery";
import { dummyText } from "@/lib/dev/dummyText";
import Image from "@/components/Image";
import React from "react";
import { ActionGroup } from "@/components/ActionGroup";
import { Button } from "@/components/Button";
import { IconDelete, IconDownload } from "@/components/Icon/components/icons";
import { LightBox, LightBoxTrigger } from "@/components/LightBox";

const meta: Meta<typeof Gallery> = {
  title: "Content/Gallery",
  component: Gallery,
  render: () => (
    <Gallery>
      <GalleryItem>
        <Image alt="Gopher" src={dummyText.imageSrc} />
        <ActionGroup>
          <Button>
            <IconDownload />
          </Button>
          <Button>
            <IconDelete />
          </Button>
        </ActionGroup>
      </GalleryItem>
      <GalleryItem>
        <Image alt="Gopher" src={dummyText.imageSrc} />
        <ActionGroup>
          <Button>
            <IconDownload />
          </Button>
          <Button>
            <IconDelete />
          </Button>
        </ActionGroup>
      </GalleryItem>
    </Gallery>
  ),
};

export default meta;

type Story = StoryObj<typeof Gallery>;

export const Default: Story = {};

export const InLightBox: Story = {
  render: () => (
    <LightBoxTrigger>
      <Button>Trigger LightBox</Button>
      <LightBox>
        <Gallery>
          <GalleryItem>
            <Image alt="Gopher" src={dummyText.imageSrc} />
            <ActionGroup>
              <Button>
                <IconDownload />
              </Button>
              <Button>
                <IconDelete />
              </Button>
            </ActionGroup>
          </GalleryItem>
          <GalleryItem>
            <Image alt="Gopher" src={dummyText.imageSrc} />
            <ActionGroup>
              <Button>
                <IconDownload />
              </Button>
              <Button>
                <IconDelete />
              </Button>
            </ActionGroup>
          </GalleryItem>
        </Gallery>
      </LightBox>
    </LightBoxTrigger>
  ),
};
