import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Section (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Section,
      Label,
      Header,
      Button,
      Heading,
      Badge,
      Switch,
      TextField,
      ColumnLayout,
      Alert,
      Text,
      Link,
    },
  }) => {
    await render(
      <>
        <Section>
          <Header>
            <Heading>
              Heading<Badge>Badge</Badge>
            </Heading>
            <Switch>Switch</Switch>
            <Button variant="soft" color="secondary">
              Secondary
            </Button>
            <Button>Primary</Button>
          </Header>
          <ColumnLayout>
            <TextField>
              <Label>First name</Label>
            </TextField>
            <TextField>
              <Label>Last name</Label>
            </TextField>
          </ColumnLayout>
        </Section>
        <Section>
          <Alert>
            <Heading>Alert</Heading>
          </Alert>
          <Heading>Heading</Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas.
          </Text>
          <Heading level={3}>Sub-Heading</Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas.
          </Text>
          <Link>Link</Link>
        </Section>
      </>,
    );

    await testScreenshot("Section");
  },
);
