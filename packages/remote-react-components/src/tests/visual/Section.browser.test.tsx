import { testEnvironments } from "@/tests/lib/environments";
import { useState, type FC } from "react";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

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
    const TestComponent: FC = () => {
      const [showButton, setShowButton] = useState(false);
      const toggleButton = () => setShowButton((prev) => !prev);

      return (
        <>
          <Section>
            <Header>
              <Heading>
                Heading<Badge>Badge</Badge>
              </Heading>
              <Switch>Switch</Switch>
              {showButton && (
                <Button variant="soft" color="secondary">
                  Secondary
                </Button>
              )}
              <Button onPress={toggleButton} data-testid="toggle-button">
                Primary
              </Button>
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
              accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
              dolore voluptas.
            </Text>
            <Heading level={3}>Sub-Heading</Heading>
            <Link>Link</Link>
          </Section>
          <Section>
            <Header>
              <Heading>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                eius quam quas vel voluptas, ullam aliquid fugit. Voluptate
                harum accusantium rerum ullam modi blanditiis vitae, laborum ea
                tempore, dolore voluptas.<Badge>Badge</Badge>
              </Heading>
              <Button>Button</Button>
            </Header>
          </Section>
        </>
      );
    };

    await render(<TestComponent />);
    await testScreenshot("Section");

    const toggleButton = page.getByTestId("toggle-button");
    await userEvent.click(toggleButton);
    await testScreenshot("Section with secondary button");
  },
);
