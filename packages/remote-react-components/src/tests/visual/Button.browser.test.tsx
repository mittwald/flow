import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { test } from "vitest";

const colors = [
  "primary",
  "accent",
  "danger",
  "secondary",
  "dark",
  "light",
] as const;
const variants = ["solid", "outline", "soft", "plain"] as const;

test.each(testEnvironments)(
  "Button states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Button, IconInfo, Text },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Flex gap="s">
          <Button>Default</Button>
          <Button>
            <IconInfo />
          </Button>
          <Button>
            <IconInfo />
            <Text>Icon & Text</Text>
          </Button>
        </Flex>
        <Flex gap="s">
          <Button size="s">Small</Button>
          <Button size="s">
            <IconInfo />
          </Button>
          <Button size="s">
            <IconInfo />
            <Text>Icon & Text</Text>
          </Button>
        </Flex>

        {variants.map((variant) => (
          <Flex gap="s" key={variant}>
            <Button variant={variant} isPending>
              {firstLetterToUppercase(variant)} Pending
            </Button>
            <Button variant={variant} isSucceeded>
              {firstLetterToUppercase(variant)} Succeeded
            </Button>
            <Button variant={variant} isFailed>
              {firstLetterToUppercase(variant)} Failed
            </Button>
            <Button variant={variant} isDisabled>
              {firstLetterToUppercase(variant)} Disabled
            </Button>
          </Flex>
        ))}
      </Flex>,
    );

    await testScreenshot("Button states");
  },
);

test.each(testEnvironments)(
  "Button colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Button, AccentBox, Wrap },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <Flex gap="s">
                {variants.map((variant) => (
                  <Button variant={variant} color={color} key={variant}>
                    {firstLetterToUppercase(color)}{" "}
                    {firstLetterToUppercase(variant)}
                  </Button>
                ))}
              </Flex>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Button colors");
  },
);

test.each(testEnvironments)(
  "Button with Avatar (%s)",
  async ({
    testScreenshot,
    render,
    components: { Avatar, Button, Initials, Flex },
  }) => {
    await render(
      <Flex gap="s">
        <Button>
          <Avatar size="l">
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
        <Button>
          <Avatar size="m">
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
        <Button>
          <Avatar size="s">
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
      </Flex>,
    );

    await testScreenshot("Button with avatar");
  },
);

test.each(testEnvironments)(
  "Button edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Button, Text, IconInfo },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Button>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
        </Button>
        <Button>
          <IconInfo />
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas. Earum pariatur, similique corrupti id officia
            perferendis. Labore, similique.
          </Text>
        </Button>
      </Flex>,
    );

    await testScreenshot("Button edge cases");
  },
);
