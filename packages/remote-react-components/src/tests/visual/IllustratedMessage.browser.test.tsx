import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";
import React from "react";

const colors = ["default", "danger", "unavailable", "dark", "light"] as const;

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
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <IllustratedMessage color={color}>
                <IconStar />
                <Heading>Heading</Heading>
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
                <Heading>Lorem ipsum dolor sit amet</Heading>
                <Text>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Cumque eius quam quas vel voluptas, ullam aliquid fugit.
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae.
        </Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
        </Text>
      </IllustratedMessage>,
    );

    await testScreenshot("IllustratedMessage edge cases");
  },
);
