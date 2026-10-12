import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "CheckboxGroup (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      Checkbox,
      CheckboxGroup,
      Label,
      FieldError,
      CheckboxButton,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxGroup>
          <Label>Default</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
        <CheckboxGroup isReadOnly>
          <Label>Readonly</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
        <CheckboxGroup isDisabled>
          <Label>Disabled</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
        <CheckboxGroup isInvalid>
          <Label>Invalid</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
          <FieldError>FieldError</FieldError>
        </CheckboxGroup>
        <CheckboxGroup>
          <Label>Buttons</Label>
          <CheckboxButton>CheckboxButton 1</CheckboxButton>
          <CheckboxButton>CheckboxButton 2</CheckboxButton>
        </CheckboxGroup>
        <CheckboxGroup l={[1, 1, 1]} m={[1, 1]}>
          <Label>ColumnLayout</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
      </Flex>,
    );

    await testScreenshot("CheckboxGroup");
  },
);

test.each(testEnvironments)(
  "CheckboxGroup with CheckboxButton cards (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, CheckboxGroup, Label, CheckboxButton, Text, Content },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxGroup l={[1]} m={[1]} s={[1]}>
          <Label>Wider than their text</Label>
          <CheckboxButton value="a">
            <Text>Image builds</Text>
            <Content>Builds and pushes images.</Content>
          </CheckboxButton>
          <CheckboxButton value="b">
            <Text>Deployments</Text>
            <Content>Rolls out new versions.</Content>
          </CheckboxButton>
        </CheckboxGroup>
        <CheckboxGroup l={[1, 1]} m={[1, 1]} s={[1, 1]}>
          <Label>Uneven text in one row</Label>
          <CheckboxButton value="a">
            <Text>Image builds</Text>
            <Content>Builds and pushes images.</Content>
          </CheckboxButton>
          <CheckboxButton value="b">
            <Text>Deployments</Text>
            <Content>
              Rolls out new versions, waits for the health checks and rolls back
              automatically when a check fails.
            </Content>
          </CheckboxButton>
        </CheckboxGroup>
      </Flex>,
    );

    await testScreenshot("CheckboxGroup with CheckboxButton cards");
  },
);
