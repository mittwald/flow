import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const colors = ["default", "danger", "unavailable", ...alphaColors] as const;

test.each(testEnvironments)(
  "IllustratedMessage content (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Heading,
      IconStar,
      IllustratedMessage,
      Text,
      Button,
      ActionGroup,
      ProgressBar,
      Label,
    },
  }) => {
    await render(
      <IllustratedMessage>
        <IconStar />
        <Heading>Heading</Heading>
        <Text>Text</Text>
        <Button>Button</Button>
        <ProgressBar value={75}>
          <Label>Label</Label>
        </ProgressBar>
        <ActionGroup>
          <Button variant="soft" color="secondary">
            Secondary
          </Button>
          <Button>Primary</Button>
        </ActionGroup>
      </IllustratedMessage>,
    );

    await testScreenshot("IllustratedMessage content");
  },
);

test.each(testEnvironments)(
  "IllustratedMessage colors (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Heading,
      Flex,
      IconStar,
      IllustratedMessage,
      Text,
      Button,
      Wrap,
      AccentBox,
    },
  }) => {
    await render(
      <Flex gap="s" align="center">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
              <IllustratedMessage color={color}>
                <IconStar />
                <Heading>{firstLetterToUppercase(color)}</Heading>
                <Text>Text</Text>
                <Button>Button</Button>
              </IllustratedMessage>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("IllustratedMessage colors");
  },
);

test.each(testEnvironments)(
  "IllustratedMessage in Section in Modal (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Button,
      ModalTrigger,
      Modal,
      Content,
      Heading,
      IllustratedMessage,
      Section,
      Text,
      IconDanger,
    },
  }) => {
    await render(
      <ModalTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <Modal>
          <Heading>Heading</Heading>
          <Content>
            <Section>
              <IllustratedMessage color="danger">
                <IconDanger />
                <Heading>A galaxy far, far away</Heading>
                <Text>
                  A long time ago in a galaxy far, far away, the Rebel Alliance
                  struck a blow against the Galactic Empire.
                </Text>
              </IllustratedMessage>
            </Section>
          </Content>
        </Modal>
      </ModalTrigger>,
    );

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await testScreenshot("IllustratedMessage in Section in Modal");
  },
);

test.each(testEnvironments)(
  "IllustratedMessage edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Heading, IllustratedMessage, Text },
  }) => {
    await render(
      <IllustratedMessage>
        <Heading>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire and stole the secret plans
          to the ultimate weapon, the Death Star.
        </Heading>
        <Text>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored station with power to destroy an entire planet. Pursued by
          sinister agents, Leia races home.
        </Text>
      </IllustratedMessage>,
    );

    await testScreenshot("IllustratedMessage edge cases");
  },
);
