import { test } from "vitest";
import { crossVersion, testEnvironments } from "@/tests/lib/environments";

const combineSince = "0.2.0-alpha.1050";

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
  "Combine Avatar and Text (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Avatar, Initials, Text, Combine },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Combine>
          <Avatar>
            <Initials>Luke Skywalker</Initials>
          </Avatar>
          <Text>
            <strong>Text</strong>
          </Text>
        </Combine>
        <Combine>
          <Avatar>
            <Initials>Luke Skywalker</Initials>
          </Avatar>
          <Text>
            <strong>Text</strong>
            Text
          </Text>
        </Combine>
        <Combine>
          <Avatar>
            <Initials>Luke Skywalker</Initials>
          </Avatar>
          <Text>
            <strong>Text</strong>
            Text
            <br />
            Text
            <br />
            Text
          </Text>
        </Combine>
      </Flex>,
    );

    await testScreenshot("Combine Avatar and Text");
  },
);

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
  "Combine Icon and Text (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, Combine, IconInfo },
  }) => {
    await render(
      <Combine>
        <IconInfo />
        <Text>Text</Text>
      </Combine>,
    );

    await testScreenshot("Combine Icon and Text");
  },
);

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
  "Combine Input and Button (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      Combine,
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
        <Combine>
          <TextField aria-label="TextField" />
          <Button>Button</Button>
        </Combine>
        <Combine>
          <TextField>
            <Label>TextField</Label>
            <FieldDescription>FieldDescription</FieldDescription>
          </TextField>
          <Button>Button</Button>
        </Combine>
        <Combine>
          <NumberField>
            <Label>NumberField</Label>
          </NumberField>
          <Button>Button</Button>
        </Combine>
        <Combine>
          <TextArea>
            <Label>TextArea</Label>
          </TextArea>
          <Button>Button</Button>
        </Combine>
        <Combine>
          <Select>
            <Label>Select</Label>
          </Select>
          <Button>Button</Button>
        </Combine>
      </Flex>,
    );

    await testScreenshot("Combine Input and Button");
  },
);

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
  "Combine Text and ContextualHelpTrigger (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Text,
      Combine,
      Button,
      ContextualHelpTrigger,
      ContextualHelp,
    },
  }) => {
    await render(
      <Combine>
        <Text>Text</Text>
        <ContextualHelpTrigger>
          <Button color="secondary" />
          <ContextualHelp />
        </ContextualHelpTrigger>
      </Combine>,
    );

    await testScreenshot("Combine Text and ContextualHelpTrigger");
  },
);

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
  "Combine Text and CopyButton (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, Combine, CopyButton },
  }) => {
    await render(
      <Combine>
        <Text>Text</Text>
        <CopyButton text="text" />
      </Combine>,
    );

    await testScreenshot("Combine Text and CopyButton");
  },
);
