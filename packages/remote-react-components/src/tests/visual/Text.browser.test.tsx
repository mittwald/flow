import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Text (%s)",
  async ({ testScreenshot, render, components: { Text, Flex, AccentBox } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Text>
          Lorem ipsum <strong>dolor sit</strong> amet consectetur
          <i>adipisicing</i> elit. Cumque eius <s>quam quas</s> vel voluptas,
          ullam aliquid fugit. Voluptate harum accusantium rerum ullam modi
          blanditiis vitae
          <br />
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
        <Text color="dark">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Text>
        <AccentBox>
          <Text color="light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas.
          </Text>
        </AccentBox>
      </Flex>,
    );

    await testScreenshot("Text");
  },
);
