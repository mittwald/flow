import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

const buttonColors = [
  "primary",
  "accent",
  "danger",
  "secondary",
  "dark",
  "light",
] as const;

const buttonVariants = ["solid", "outline", "soft", "plain"] as const;

const firstLetterToUppercase = (text: string) => {
  return text[0]!.toUpperCase() + text.slice(1).toLowerCase();
};

test.each(testEnvironments)(
  "Button states (%s)",
  async ({
    container,
    render,
    components: { Flex, Button, IconInfo, Text },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Flex gap="s">
          <Button>Default</Button>
          <Button data-testid="hover">Hover</Button>
          <Button>Focus</Button>
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

        {buttonVariants.map((variant) => (
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

    const hoverButton = page.getByTestId("hover");
    await hoverButton.hover();

    // tab to focus the last button
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("Button states");
  },
);

test.each(testEnvironments)(
  "Button colors (%s)",
  async ({
    container,
    render,
    components: { Flex, Button, AccentBox, Wrap },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {buttonColors.map((color) => (
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <Flex gap="s" key={color}>
                {buttonVariants.map((variant) => (
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

    await expect(container).toMatchScreenshot("Button colors");
  },
);

test.each(testEnvironments)(
  "Button with Avatar (%s)",
  async ({
    container,
    render,
    components: { Avatar, Button, Initials, Flex },
  }) => {
    await render(
      <Flex gap="s">
        <Button>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
        <Button data-testid="hover">
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
        <Button>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
      </Flex>,
    );

    const hoverButton = page.getByTestId("hover");
    await hoverButton.hover();

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("Button with avatar");
  },
);

test.each(testEnvironments)(
  "Button pressed (%s)",
  async ({ container, render, components: { Button } }) => {
    await render(<Button data-testid="pressed">Pressed</Button>);

    const pressedButton = page.getByTestId("pressed");

    await Promise.all([
      pressedButton.click({ delay: 500 }),
      new Promise((res) => setTimeout(res, 100)).then(() =>
        expect(container).toMatchScreenshot("Button pressed"),
      ),
    ]);
  },
);

test.each(testEnvironments)(
  "Button edge cases (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("Button edge cases");
  },
);
