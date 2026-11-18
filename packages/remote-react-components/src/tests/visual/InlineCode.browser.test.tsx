import { testEnvironments } from "@/tests/lib/environments";
import { alphaColorAccentBoxBackground } from "@/tests/lib/alphaColorAccentBoxBackground";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const colors = ["default", ...alphaColors] as const;

test.each(testEnvironments)(
  "InlineCode (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      InlineCode,
      Wrap,
      AccentBox,
      Text,
      ColumnLayout,
      LabeledValue,
      Label,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox backgroundColor={alphaColorAccentBoxBackground(color)}>
              <InlineCode color={color}>
                {firstLetterToUppercase(color)}
              </InlineCode>
            </AccentBox>
          </Wrap>
        ))}
        <Flex>
          <Text>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a blow against the Galactic Empire.
            <InlineCode>
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a blow against the Galactic Empire.
            </InlineCode>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a blow against the Galactic Empire.
            <InlineCode>
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a blow against the Galactic Empire.
            </InlineCode>
          </Text>
        </Flex>
        <ColumnLayout l={[1, 1, 1, 1]}>
          <LabeledValue>
            <Label>default</Label>
            <InlineCode>struckABlowAgainstTheGalacticEmpire</InlineCode>
          </LabeledValue>
          <LabeledValue>
            <Label>nowrap</Label>
            <InlineCode whiteSpace="nowrap">
              struckABlowAgainstTheGalacticEmpire
            </InlineCode>
          </LabeledValue>
        </ColumnLayout>
      </Flex>,
    );

    await testScreenshot("InlineCode");
  },
);
