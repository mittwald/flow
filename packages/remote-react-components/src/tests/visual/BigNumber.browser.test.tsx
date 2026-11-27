import { testEnvironments } from "@/tests/lib/environments";
import { alphaColorAccentBoxBackground } from "@/tests/lib/alphaColorAccentBoxBackground";
import { test } from "vitest";
import { IconArrowDownRight } from "@tabler/icons-react";

const staticColors = ["light-static", "dark-static"] as const;

test.each(testEnvironments)(
  "BigNumber (%s)",
  async ({
    testScreenshot,
    render,
    components: { AccentBox, BigNumber, ColumnLayout, Icon, IconPlus, Text },
  }) => {
    await render(
      <ColumnLayout l={[1, 1, 1]} m={[1, 1, 1]} s={[1, 1, 1]} columnGap="xl">
        <BigNumber>
          <Text>65%</Text>
          <Text>Performance</Text>
        </BigNumber>
        {/* The content color of the AccentBox reaches the texts. */}
        {staticColors.map((color) => (
          <AccentBox
            key={color}
            backgroundColor={alphaColorAccentBoxBackground(color)}
            color={color}
          >
            <BigNumber>
              <Text>65%</Text>
              <Text>Performance</Text>
            </BigNumber>
          </AccentBox>
        ))}
        <BigNumber>
          <IconPlus />
          <Text>65%</Text>
          <Text>Icon before</Text>
        </BigNumber>
        <BigNumber>
          <Text>65%</Text>
          <Icon color="danger" aria-label="Decreased">
            <IconArrowDownRight />
          </Icon>
          <Text>Icon after</Text>
        </BigNumber>
      </ColumnLayout>,
    );

    await testScreenshot("BigNumber");
  },
);
