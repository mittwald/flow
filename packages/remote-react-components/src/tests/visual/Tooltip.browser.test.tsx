import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import React from "react";

test.each(testEnvironments)(
  "Tooltip (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("Tooltip - visible");
  },
);
