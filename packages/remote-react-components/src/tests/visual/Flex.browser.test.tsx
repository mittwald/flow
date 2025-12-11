import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "Flex (%s)",
  async ({ container, render, components: { Flex, AccentBox, Label } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Label>gap: xl</Label>
        <Flex gap="xl">
          <AccentBox />
          <AccentBox />
        </Flex>
        <Label>direction: column</Label>
        <Flex direction="column" gap="l">
          <AccentBox />
          <AccentBox />
        </Flex>
        <Label>justify: end</Label>
        <Flex justify="end">
          <AccentBox />
        </Flex>
        <Label>padding: xl</Label>
        <Flex padding="xl">
          <AccentBox />
        </Flex>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Flex");
  },
);
