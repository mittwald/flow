import { test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";

test.each(testEnvironments)(
  "Align Avatar and Text (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Avatar, Initials, Text, Align },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            <strong>Text</strong>
          </Text>
        </Align>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            <strong>Text</strong>
            Text
          </Text>
        </Align>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            <strong>Text</strong>
            Text
            <br />
            Text
            <br />
            Text
          </Text>
        </Align>
      </Flex>,
    );

    await testScreenshot("Align Avatar and Text");
  },
);

test.each(testEnvironments)(
  "Align Icon and Text (%s)",
  async ({ testScreenshot, render, components: { Text, Align, IconInfo } }) => {
    await render(
      <Align>
        <IconInfo />
        <Text>Text</Text>
      </Align>,
    );

    await testScreenshot("Align Icon and Text");
  },
);

test.each(testEnvironments)(
  "Align Input and Button (%s)",
  async ({
    testScreenshot,
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
      FieldDescription,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Align>
          <TextField aria-label="TextField" />
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

    await testScreenshot("Align Input and Button");
  },
);

test.each(testEnvironments)(
  "Align Text and ContextualHelpTrigger (%s)",
  async ({
    testScreenshot,
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

    await testScreenshot("Align Text and ContextualHelpTrigger");
  },
);

test.each(testEnvironments)(
  "Align Text and CopyButton (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, Align, CopyButton },
  }) => {
    await render(
      <Align>
        <Text>Text</Text>
        <CopyButton text="text" />
      </Align>,
    );

    await testScreenshot("Align Text and CopyButton");
  },
);
