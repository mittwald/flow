import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "CheckboxButton states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, CheckboxButton, Text, Content },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxButton>Default</CheckboxButton>
        <CheckboxButton>
          <Text>Text</Text>
          <Content>Content</Content>
        </CheckboxButton>
        <CheckboxButton isSelected>Selected</CheckboxButton>
        <CheckboxButton isIndeterminate>Indeterminate</CheckboxButton>
        <CheckboxButton isReadOnly>Readonly</CheckboxButton>
        <CheckboxButton isDisabled>Disabled</CheckboxButton>
        <CheckboxButton isDisabled isSelected>
          Disabled Selected
        </CheckboxButton>
      </Flex>,
    );

    await testScreenshot("CheckboxButton states");
  },
);

test.each(testEnvironments)(
  "Checkbox edge cases(%s)",
  async ({
    testScreenshot,
    render,
    components: { CheckboxButton, Text, Content, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxButton>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
        </CheckboxButton>
        <CheckboxButton>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas. Earum pariatur, similique corrupti id officia
            perferendis. Labore, similique.
          </Text>
          <Content>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas. Earum pariatur, similique corrupti id officia
            perferendis. Labore, similique.
          </Content>
        </CheckboxButton>
      </Flex>,
    );

    await testScreenshot("Checkbox edge cases");
  },
);
