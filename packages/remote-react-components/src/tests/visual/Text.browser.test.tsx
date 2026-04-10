import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import React from "react";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["default", ...alphaColors] as const;

test.each(testEnvironments)(
  "Text (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, Flex, AccentBox, Wrap },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
              <Text color={color}>
                Lorem ipsum <strong>dolor sit</strong> amet consectetur
                <i>adipisicing</i> elit. Cumque eius <s>quam quas</s> vel
                voluptas, ullam aliquid fugit.
              </Text>
            </AccentBox>
          </Wrap>
        ))}
        <Text>
          <small>laborum ea tempore, dolore voluptas.</small>
          <ul>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
          </ul>
          <ol>
            <li>Item</li>
            <li>Item</li>
            <li>Item</li>
          </ol>
        </Text>
      </Flex>,
    );

    await testScreenshot("Text");
  },
);

test.each(testEnvironments)(
  "Text edge cases (%s)",
  async ({ testScreenshot, render, components: { Text, Flex, IconStar } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Text>
          LoremipsumdolorsitametconsecteturadipisicingelitCumqueeiusquamquasvelvoluptasullamaliquidfugitVoluptateharumaccusantiumrerumullammodiblanditiisvitaelaborumeatemporedolorevoluptasEarumpariatursimiliquecorruptiidofficiaperferendisLaboresimiliqueEarumquasinAtdoloremcorruptiblanditiisnulladeseruntlaborumCorruptidelectusaspernaturnihilnullaobcaecatiipsamporrosequiremQuam
        </Text>
        <Text wordBreak="break-word">
          LoremipsumdolorsitametconsecteturadipisicingelitCumqueeiusquamquasvelvoluptasullamaliquidfugitVoluptateharumaccusantiumrerumullammodiblanditiisvitaelaborumeatemporedolorevoluptasEarumpariatursimiliquecorruptiidofficiaperferendisLaboresimiliqueEarumquasinAtdoloremcorruptiblanditiisnulladeseruntlaborumCorruptidelectusaspernaturnihilnullaobcaecatiipsamporrosequiremQuam
        </Text>
        <Text>
          <IconStar /> Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
        <Text>
          <small>
            <IconStar /> Lorem ipsum dolor sit amet consectetur adipisicing
            elit.
          </small>
        </Text>
      </Flex>,
    );

    await testScreenshot("Text edge cases");
  },
);
