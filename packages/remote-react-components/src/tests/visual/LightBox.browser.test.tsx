import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";
import gopher from "@/tests/assets/gopher.webp";
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
      IconDelete,
      IconDownload,
      Gallery,
      GalleryItem,
    },
  }) => {
    await render(
      <LightBoxTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <LightBox>
          <Gallery>
            <GalleryItem>
              <Image src={gopher} />
              <ActionGroup>
                <Button>
                  <IconDelete />
                </Button>
                <Button>
                  <IconDownload />
                </Button>
              </ActionGroup>
            </GalleryItem>
            <GalleryItem>
              <Image src={gopher} />
              <ActionGroup>
                <Button>
                  <IconDelete />
                </Button>
                <Button>
                  <IconDownload />
                </Button>
              </ActionGroup>
            </GalleryItem>
          </Gallery>
        </LightBox>
      </LightBoxTrigger>,
    );

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await testScreenshot("LightBox with Gallery - opened");

    const next = page.getByLocator('[aria-label="Next"]');
    await next.click();

    await testScreenshot("LightBox with Gallery - next");

    await userEvent.keyboard("{escape}");

    await testScreenshot("LightBox with Gallery  - closed");
  },
);
