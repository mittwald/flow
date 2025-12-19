import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "ColumnLayout (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, ColumnLayout, AccentBox, Label },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Label>Default</Label>
        <ColumnLayout>
          <AccentBox />
          <AccentBox />
          <AccentBox />
          <AccentBox />
          <AccentBox />
          <AccentBox />
        </ColumnLayout>
        <Label>Custom ratio and gap</Label>
        <ColumnLayout l={[2, 1]} gap="xl">
          <AccentBox />
          <AccentBox />
        </ColumnLayout>
        <Label>Nested</Label>
        <ColumnLayout l={[1, 1]}>
          <AccentBox />
          <ColumnLayout>
            <AccentBox />
            <ColumnLayout>
              <AccentBox />
              <AccentBox />
            </ColumnLayout>
          </ColumnLayout>
        </ColumnLayout>
        <Label>Hidden column</Label>
        <ColumnLayout l={[1, null]}>
          <AccentBox />
          <AccentBox />
        </ColumnLayout>
      </Flex>,
    );

    await testScreenshot("ColumnLayout");
  },
);
