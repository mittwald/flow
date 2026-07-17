import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Rating states (%s)",
  async ({ testScreenshot, render, components: { Flex, Rating, Label } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Rating>
          <Label>Default</Label>
        </Rating>
        <Rating value={3}>
          <Label>Value</Label>
        </Rating>
        <Rating value={5} size="s">
          <Label>Small</Label>
        </Rating>
        <Rating value={5} isReadOnly>
          <Label>Readonly</Label>
        </Rating>
      </Flex>,
    );

    await testScreenshot("Rating states");
  },
);

test.each(testEnvironments)(
  "Rating interaction (%s)",
  async ({ testScreenshot, render, components: { Rating, Label } }) => {
    await render(
      <Rating defaultValue={1}>
        <Label>Label</Label>
      </Rating>,
    );

    const option = page.getByLocator("label:has(input[value='3'])");

    await testScreenshot("Rating interaction - default");

    await option.click();

    await testScreenshot("Rating interaction - option selected");
  },
);

// Element tree diverges at alpha.791 and earlier; comparable from alpha.883.
test.skipIf(crossVersion({ below: "0.2.0-alpha.883" })).each(testEnvironments)(
  "Rating custom icon (%s)",
  async ({
    testScreenshot,
    render,
    components: { Rating, Label, IconHome },
  }) => {
    await render(
      <Rating
        defaultValue={2}
        iconFilled={<IconHome status="success" />}
        iconEmpty={<IconHome />}
      >
        <Label>Custom icon</Label>
      </Rating>,
    );

    await testScreenshot("Rating custom icon");
  },
);
