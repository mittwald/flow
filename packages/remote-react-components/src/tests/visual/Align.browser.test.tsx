import { expect, test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";
import React from "react";
import { FieldDescription } from "@/auto-generated";

test.each(testEnvironments)(
  "Align Avatar and Text (%s)",
  async ({
    container,
    render,
    components: { Flex, Avatar, Initials, Text, Align },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>Text</Text>
        </Align>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            Text
            <br />
            Text
          </Text>
        </Align>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            Text
            <br />
            Text
            <br />
            Text
            <br />
            Text
          </Text>
        </Align>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Align Avatar and Text");
  },
);

test.each(testEnvironments)(
  "Align Icon and Text (%s)",
  async ({ container, render, components: { Text, Align, IconInfo } }) => {
    await render(
      <Align>
        <IconInfo />
        <Text>Text</Text>
      </Align>,
    );

    await expect(container).toMatchScreenshot("Align Icon and Text");
  },
);

test.each(testEnvironments)(
  "Align Input and Button (%s)",
  async ({
    container,
    render,
    components: {
      Flex,
      Align,
      TextField,
      Button,
      Label,
      NumberField,
      TextArea,
      Select,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Align>
          <TextField />
          <Button>Button</Button>
        </Align>
        <Align>
          <TextField>
            <Label>TextField</Label>
            <FieldDescription>FieldDescription</FieldDescription>
          </TextField>
          <Button>Button</Button>
        </Align>
        <Align>
          <NumberField>
            <Label>NumberField</Label>
          </NumberField>
          <Button>Button</Button>
        </Align>
        <Align>
          <TextArea>
            <Label>TextArea</Label>
          </TextArea>
          <Button>Button</Button>
        </Align>
        <Align>
          <Select>
            <Label>Select</Label>
          </Select>
          <Button>Button</Button>
        </Align>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Align Input and Button");
  },
);

test.each(testEnvironments)(
  "Align Text and ContextualHelpTrigger (%s)",
  async ({
    container,
    render,
    components: { Text, Align, Button, ContextualHelpTrigger, ContextualHelp },
  }) => {
    await render(
      <Align>
        <Text>Text</Text>
        <ContextualHelpTrigger>
          <Button color="secondary" />
          <ContextualHelp />
        </ContextualHelpTrigger>
      </Align>,
    );

    await expect(container).toMatchScreenshot(
      "Align Text and ContextualHelpTrigger",
    );
  },
);

test.each(testEnvironments)(
  "Align Text and CopyButton (%s)",
  async ({ container, render, components: { Text, Align, CopyButton } }) => {
    await render(
      <Align>
        <Text>Text</Text>
        <CopyButton text="text" />
      </Align>,
    );

    await expect(container).toMatchScreenshot("Align Text and CopyButton");
  },
);
