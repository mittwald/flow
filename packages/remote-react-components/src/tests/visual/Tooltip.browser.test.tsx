import { testEnvironments } from "@/tests/lib/environments";
import { sleep } from "@/tests/lib/sleep";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Tooltip (%s)",
  async ({
    testScreenshot,
    render,
    components: { Tooltip, TooltipTrigger, Button },
  }) => {
    await render(
      <TooltipTrigger>
        <Button datat-testid="button">Button</Button>
        <Tooltip>Tooltip</Tooltip>
      </TooltipTrigger>,
    );

    const button = page.getByLocator("button");

    await button.hover();
    await sleep(1500);

    await testScreenshot("Tooltip - visible");
  },
);
