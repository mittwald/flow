import { testEnvironments } from "@/tests/lib/environments";
import { useState, type FC } from "react";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

/**
 * Stands in for a boundary, permission gate or empty list — a child that is
 * present but renders nothing.
 */
const RendersNothing: FC = () => null;

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
              <Link>Link</Link>
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
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a decisive blow against the Galactic Empire. Rebel spies
              managed to steal secret plans to the Empire's ultimate weapon, the
              Death Star.
            </Text>
            <Heading level={3}>Sub-Heading</Heading>
            <Link>Link</Link>
          </Section>
          {/* Must collapse: a section that renders no content may neither draw
              its own separator nor claim section-to-section spacing, so the
              section below it keeps exactly one separator. */}
          <Section>
            <RendersNothing />
          </Section>
          <Section>
            <Header>
              <Heading>
                A long time ago in a galaxy far, far away, the Rebel Alliance
                struck a decisive blow against the Galactic Empire. Rebel spies
                managed to steal secret plans to the Empire's ultimate weapon,
                the Death Star.<Badge>Badge</Badge>
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
