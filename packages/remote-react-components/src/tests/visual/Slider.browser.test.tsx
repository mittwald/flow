import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Slider states (%s)",
  async ({
    container,
    render,
    components: { Flex, Slider, Label, FieldError, FieldDescription },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Slider defaultValue={20}>
          <Label>Default</Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </Slider>
        <Slider isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </Slider>
        <Slider isReadOnly defaultValue={20}>
          <Label>Readonly</Label>
        </Slider>
        <Slider isDisabled defaultValue={20}>
          <Label>Disabled</Label>
        </Slider>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Slider states");
  },
);

test.each(testEnvironments)(
  "Slider interaction (%s)",
  async ({ container, render, components: { Slider, Label } }) => {
    await render(
      <Slider defaultValue={2} minValue={0} maxValue={4} showInitialMarker>
        <Label>Label</Label>
      </Slider>,
    );

    const increment = page.getByLocator("[aria-label='Increment value']");
    const decrement = page.getByLocator("[aria-label='Decrement value']");

    await expect(container).toMatchScreenshot("Slider interaction - default");

    await increment.click();
    await increment.click();
    await increment.click();

    await expect(container).toMatchScreenshot(
      "Slider interaction - incremented",
    );

    await decrement.click();

    await expect(container).toMatchScreenshot(
      "Slider interaction - decremented",
    );
  },
);
