import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "LayoutCard (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      LayoutCard,
      Flex,
      Tab,
      Tabs,
      TabTitle,
      Alert,
      Heading,
      Section,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <LayoutCard>LayoutCard</LayoutCard>
        <LayoutCard>
          <Tabs>
            <Tab id="general">
              <TabTitle>Tab 1</TabTitle>
              Content
            </Tab>
            <Tab id="storage">
              <TabTitle>Tab 2</TabTitle>
              Content
            </Tab>
          </Tabs>
        </LayoutCard>
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
