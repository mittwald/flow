import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "CheckboxButton states (%s)",
  async ({
    container,
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
        <CheckboxButton>Focus</CheckboxButton>
        <CheckboxButton isSelected>Selected</CheckboxButton>
        <CheckboxButton isIndeterminate>Indeterminate</CheckboxButton>
        <CheckboxButton isReadOnly>Readonly</CheckboxButton>
        <CheckboxButton isDisabled>Disabled</CheckboxButton>
        <CheckboxButton isDisabled isSelected>
          Disabled Selected
        </CheckboxButton>
      </Flex>,
    );

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("CheckboxButton states");
  },
);

test.each(testEnvironments)(
  "Checkbox edge cases(%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("Checkbox edge cases");
  },
);
