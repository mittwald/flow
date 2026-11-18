import { test } from "vitest";
import { crossVersion, testEnvironments } from "@/tests/lib/environments";

const combineSince = "0.2.0-alpha.1050";

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
  "Combine (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      Avatar,
      Initials,
      Text,
      Combine,
      IconInfo,
      Button,
      ContextualHelpTrigger,
      ContextualHelp,
      CopyButton,
      Kbd,
    },
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
        <Combine>
          <IconInfo />
          <Text>Text</Text>
        </Combine>
        <Combine>
          <Text>Text</Text>
          <ContextualHelpTrigger>
            <Button color="secondary" />
            <ContextualHelp />
          </ContextualHelpTrigger>
        </Combine>
        <Combine>
          <Text>Text</Text>
          <CopyButton text="text" />
        </Combine>
        <Combine>
          <Kbd variant="soft">↑</Kbd>
          <Kbd variant="soft">↓</Kbd>
        </Combine>
        <Combine>
          <Kbd variant="soft">Esc</Kbd>
          <Text>Text</Text>
        </Combine>
        <Combine>
          <Kbd variant="soft">↑</Kbd>
          <Kbd variant="soft">↓</Kbd>
          <Text>Text</Text>
        </Combine>
        <Combine>
          <Kbd keys={["mod", "k"]} />
          <Text>Text</Text>
        </Combine>
      </Flex>,
    );

    await testScreenshot("Combine");
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
