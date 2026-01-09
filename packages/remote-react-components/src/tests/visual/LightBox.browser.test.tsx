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
