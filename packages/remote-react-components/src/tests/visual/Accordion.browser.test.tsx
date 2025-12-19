import { test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Accordion states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Accordion, Heading, Content, Label },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Accordion>
          <Heading>Default</Heading>
          <Content>Content</Content>
        </Accordion>
        <Accordion defaultExpanded>
          <Heading>Default Expanded</Heading>
          <Content>Content</Content>
        </Accordion>
        <Accordion data-testid="hover">
          <Heading>Hovered</Heading>
          <Content>Content</Content>
        </Accordion>
        <Accordion>
          <Label>Label</Label>
          <Content>Content</Content>
        </Accordion>
        <Accordion variant="outline">
          <Heading>Outline</Heading>
          <Content>Content</Content>
        </Accordion>
      </Flex>,
    );

    const hover = page.getByTestId("hover");
    await hover.hover();

    await testScreenshot("Accordion states");
  },
);

test.each(testEnvironments)(
  "Accordion clicked (%s)",
  async ({
    testScreenshot,
    render,
    components: { Accordion, Heading, Content },
  }) => {
    await render(
      <Accordion>
        <Heading data-testid="click">Heading</Heading>
        <Content>Content</Content>
      </Accordion>,
    );

    const click = page.getByTestId("click");

    await testScreenshot("Accordion - default");

    await click.click();

    await testScreenshot("Accordion - expanded");

    await click.click();

    await testScreenshot("Accordion - collapsed");
  },
);

test.each(testEnvironments)(
  "Accordion edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Accordion, Heading, Content },
  }) => {
    await render(
      <Accordion>
        <Heading>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
        </Heading>
        <Content>Content</Content>
      </Accordion>,
    );

    await testScreenshot("Accordion edge cases");
  },
);
