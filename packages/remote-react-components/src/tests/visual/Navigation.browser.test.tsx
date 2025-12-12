import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Navigation (%s)",
  async ({
    container,
    render,
    components: { Navigation, Link, IconStar, Text, NavigationGroup, Label },
  }) => {
    await render(
      <Navigation>
        <Link>
          <IconStar />
          <Text>Link</Text>
        </Link>
        <Link>
          <IconStar />
          <Text>Link</Text>
        </Link>
        <NavigationGroup>
          <Label>NavigationGroup</Label>
          <Link>Link</Link>
          <Link>Link</Link>
        </NavigationGroup>
        <NavigationGroup collapsable>
          <Label data-testid="trigger">Collapsable</Label>
          <Link>Link</Link>
          <Link>Link</Link>
        </NavigationGroup>
      </Navigation>,
    );

    await expect(container).toMatchScreenshot("Navigation - default");

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await expect(container).toMatchScreenshot("Navigation - collapsed");
  },
);
