import { expect, test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "Accordion states (%s)",
  async ({
    container,
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
          <Heading>Focused</Heading>
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

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("Accordion states - default");
  },
);

test.each(testEnvironments)(
  "Accordion clicked (%s)",
  async ({
    container,
    render,
    components: { Accordion, Heading, Content },
  }) => {
    await render(
      <Accordion>
        <Heading data-testid="click">Clicked</Heading>
        <Content>Content</Content>
      </Accordion>,
    );

    const click = page.getByTestId("click");
    await click.click();

    await expect(container).toMatchScreenshot("Accordion expanded");

    await click.click();

    await expect(container).toMatchScreenshot("Accordion collapsed");
  },
);
