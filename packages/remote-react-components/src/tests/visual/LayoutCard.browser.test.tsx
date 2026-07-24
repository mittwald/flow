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
      TabNavigation,
      Alert,
      Heading,
      Section,
      Link,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <LayoutCard>LayoutCard</LayoutCard>
        <LayoutCard>
          <TabNavigation>
            <Link>Tab 1</Link>
            <Link>Tab 2</Link>
          </TabNavigation>
          Content
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
