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
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored space station with enough power to destroy an entire planet,
          and fled to the fourth moon of Yavin.
        </Heading>
        <Content>Content</Content>
      </Accordion>,
    );

    await testScreenshot("Accordion edge cases");
  },
);
