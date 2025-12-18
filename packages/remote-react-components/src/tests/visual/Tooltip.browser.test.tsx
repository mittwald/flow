import { testEnvironments } from "@/tests/lib/environments";
import { test, vitest } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Tooltip (%s)",
  async ({
    testScreenshot,
    render,
    components: { Tooltip, TooltipTrigger, Button },
  }) => {
    vitest.useFakeTimers({
      advanceTimeDelta: 100,
      shouldAdvanceTime: true,
    });

    await render(
      <TooltipTrigger>
        <Button datat-testid="button">Button</Button>
        <Tooltip>Tooltip</Tooltip>
      </TooltipTrigger>,
    );

    const button = page.getByLocator("button");

    await button.hover();
    await vitest.advanceTimersByTimeAsync(5000);

    await testScreenshot("Tooltip - visible");
  },
);
