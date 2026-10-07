import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "LayoutCard (%s)",
  async ({
    testScreenshot,
    render,
    components: { LayoutCard, Flex, Alert, Heading, Section },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <LayoutCard>LayoutCard</LayoutCard>
        <LayoutCard>
          <Alert>
            <Heading>Alert</Heading>
          </Alert>
          <Section>
            <Heading>Section</Heading>
          </Section>
        </LayoutCard>
      </Flex>,
    );

    await testScreenshot("LayoutCard");
  },
);

test.each(testEnvironments)(
  "LayoutCard with alerts (%s)",
  async ({
    testScreenshot,
    render,
    components: { LayoutCard, Alert, Heading, Section, Text },
  }) => {
    await render(
      <LayoutCard>
        <Alert status="danger">
          <Heading>Danger</Heading>
        </Alert>
        <Alert status="warning">
          <Heading>Warning</Heading>
        </Alert>
        <Section>
          <Heading>Section</Heading>
          <Alert>
            <Heading>Info</Heading>
          </Alert>
          <Alert status="success">
            <Heading>Success</Heading>
          </Alert>
          <Text>Text</Text>
        </Section>
      </LayoutCard>,
    );

    await testScreenshot("LayoutCard with alerts");
  },
);

// TabNavigation was introduced in alpha.977.
test.skipIf(crossVersion({ below: "0.2.0-alpha.977" })).each(testEnvironments)(
  "LayoutCard with TabNavigation (%s)",
  async ({
    testScreenshot,
    render,
    components: { LayoutCard, TabNavigation, Link },
  }) => {
    await render(
      <LayoutCard>
        <TabNavigation>
          <Link href="#" aria-current="page">
            Tab 1
          </Link>
          <Link href="#">Tab 2</Link>
        </TabNavigation>
        Content
      </LayoutCard>,
    );

    await testScreenshot("LayoutCard with TabNavigation");
  },
);
