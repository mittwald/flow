import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["default", ...alphaColors] as const;

test.each(testEnvironments)(
  "Text colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, Flex, AccentBox, Wrap, Link },
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
                The Rebel <strong>Alliance struck</strong> a decisive
                <i>blow against</i> the Empire. Rebel spies <s>stole plans</s>{" "}
                to the <Link>Death Star</Link> weapon.
              </Text>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Text colors");
  },
);

test.each(testEnvironments)(
  "Text edge cases (%s)",
  async ({ testScreenshot, render, components: { Text, Flex, IconStar } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Text>
          AlongtimeagoinagalaxyfarfarawaytheRebelAlliancestruckadecisiveblowagainsttheGalacticEmpireRebelspiesmanagedtostealthesecretplanstotheEmpiresultimateweaponcalledtheDeathStaranarmoredspacestationwithenoughpowertodestroyanentireplanetPrincessLeiaracedhomeaboardherstarshipcustodianofthestolenplansthatcansaveherpeopleandrestorefreedomtothegalaxyHopeRemains
        </Text>
        <Text wordBreak="break-word">
          AlongtimeagoinagalaxyfarfarawaytheRebelAlliancestruckadecisiveblowagainsttheGalacticEmpireRebelspiesmanagedtostealthesecretplanstotheEmpiresultimateweaponcalledtheDeathStaranarmoredspacestationwithenoughpowertodestroyanentireplanetPrincessLeiaracedhomeaboardherstarshipcustodianofthestolenplansthatcansaveherpeopleandrestorefreedomtothegalaxyHopeRemains
        </Text>
        <Text>
          <small>the secret plans to the Death Star.</small>
          <ul>
            <li>Item</li>
            <li>Item</li>
          </ul>
          <ol>
            <li>Item</li>
            <li>Item</li>
          </ol>
        </Text>
        <Text>
          <IconStar /> The Rebel Alliance struck against the Galactic Empire.
        </Text>
        <Text>
          <small>
            <IconStar /> The Rebel Alliance struck against the Galactic Empire.
          </small>
        </Text>
        <Text noLigatures>5x4</Text>
        <Text>5x4</Text>
      </Flex>,
    );

    await testScreenshot("Text edge cases");
  },
);
