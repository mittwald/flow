import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const states = ["info", "success", "warning", "danger", "unavailable"] as const;

test.each(testEnvironments)(
  "AlertText states (%s)",
  async ({ testScreenshot, render, components: { AlertText, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        {states.map((status) => (
          <AlertText key={status} status={status}>
            {firstLetterToUppercase(status)}
          </AlertText>
        ))}
      </Flex>,
    );

    await testScreenshot("AlertText states");
  },
);

test.each(testEnvironments)(
  "AlertText edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { AlertText, Flex, Text, Heading },
  }) => {
    await render(
      <Flex direction="column">
        <AlertText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </AlertText>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit Cumque eius
          quam quas vel voluptas
          <AlertText>
            Lorem ipsum dolor sit amet consectetur adipisicing elit Cumque eius
            quam quas vel voluptas
          </AlertText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit Cumque eius
          quam quas vel voluptas
        </Text>
        <Heading>
          <AlertText>
            Lorem ipsum dolor sit amet consectetur adipisicing elit
          </AlertText>
        </Heading>
      </Flex>,
    );

    await testScreenshot("AlertText edge cases");
  },
);
