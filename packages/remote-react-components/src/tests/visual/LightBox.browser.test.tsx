import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";
import gopher from "@/tests/assets/gopher.webp";
import logo from "@/tests/assets/mittwald_logo_rgb.jpg";
import { userEvent } from "vitest/browser";
import React from "react";

test.each(testEnvironments)(
  "LightBox (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Button,
      LightBox,
      LightBoxTrigger,
      Image,
      ActionGroup,
      IconDelete,
      IconDownload,
    },
  }) => {
    await render(
      <LightBoxTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <LightBox>
          <Image src={gopher} />
          <ActionGroup>
            <Button>
              <IconDelete />
            </Button>
            <Button>
              <IconDownload />
            </Button>
          </ActionGroup>
        </LightBox>
      </LightBoxTrigger>,
    );

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await testScreenshot("LightBox - opened");

    await userEvent.keyboard("{escape}");

    await testScreenshot("LightBox - closed");
  },
);

test.each(testEnvironments)(
  "LightBox with Gallery (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Button,
      LightBox,
      LightBoxTrigger,
      Image,
      ActionGroup,
      LightBoxGallery,
      LightBoxGalleryItem,
      IconDownload,
    },
  }) => {
    await render(
      <LightBoxTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <LightBox>
          <LightBoxGallery>
            <LightBoxGalleryItem>
              <Image src={gopher} />
              <ActionGroup>
                <Button>
                  <IconDownload />
                </Button>
              </ActionGroup>
            </LightBoxGalleryItem>
            <LightBoxGalleryItem>
              <Image src={logo} />
              <ActionGroup>
                <Button>
                  <IconDownload />
                </Button>
              </ActionGroup>
            </LightBoxGalleryItem>
          </LightBoxGallery>
        </LightBox>
      </LightBoxTrigger>,
    );

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await testScreenshot("LightBox  with Gallery - opened");

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("LightBox  with Gallery - previous");

    await userEvent.keyboard("{escape}");

    await testScreenshot("LightBox  with Gallery - closed");
  },
);
