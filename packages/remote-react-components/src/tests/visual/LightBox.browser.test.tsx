import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";
import gopher from "@/tests/assets/gopher.webp";
import logo from "@/tests/assets/mittwald_logo_rgb.jpg";
import logoLandscape from "@/tests/assets/mittwald_logo_landscape.jpg";
import logoPortrait from "@/tests/assets/mittwald_logo_portrait.jpg";
import { userEvent } from "vitest/browser";

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

// LightBoxGallery element tree comparable from alpha.883.
test.skipIf(crossVersion({ below: "0.2.0-alpha.883" })).each(testEnvironments)(
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

// Tall images are capped by the item's max height, wide ones by the image's
// max width; both have to keep their aspect ratio.
test.skipIf(crossVersion({ below: "0.2.0-alpha.883" })).each(testEnvironments)(
  "LightBox with Gallery - aspect ratio (%s)",
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
              <Image src={logoPortrait} />
              <ActionGroup>
                <Button>
                  <IconDownload />
                </Button>
              </ActionGroup>
            </LightBoxGalleryItem>
            <LightBoxGalleryItem>
              <Image src={logoLandscape} />
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

    await testScreenshot("LightBox with Gallery - portrait");

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("LightBox with Gallery - landscape");
  },
);
