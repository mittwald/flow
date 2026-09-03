import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "RadioGroup with Radio (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      RadioGroup,
      Label,
      FieldError,
      FieldDescription,
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
      Radio,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <RadioGroup isRequired defaultValue="1">
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
          <FieldDescription>FieldDescription</FieldDescription>
        </RadioGroup>
        <RadioGroup isInvalid>
          <Label>Invalid</Label>
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
          <FieldError>FieldError</FieldError>
        </RadioGroup>
        <RadioGroup isReadOnly defaultValue="1">
          <Label>Readonly</Label>
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
        </RadioGroup>
        <RadioGroup defaultValue="2">
          <Label>Option disabled</Label>
          <Radio value="1" isDisabled>
            Option 1
          </Radio>
          <Radio value="2">Option 2</Radio>
        </RadioGroup>
      </Flex>,
    );

    await testScreenshot("RadioGroup with Radio");
  },
);

test.each(testEnvironments)(
  "RadioGroup with RadioButton (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      RadioGroup,
      Label,
      FieldError,
      FieldDescription,
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
      RadioButton,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <RadioGroup isRequired defaultValue="1">
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <RadioButton value="1">Option 1</RadioButton>
          <RadioButton value="2">Option 2</RadioButton>
          <FieldDescription>FieldDescription</FieldDescription>
        </RadioGroup>
        <RadioGroup isInvalid>
          <Label>Invalid</Label>
          <RadioButton value="1">Option 1</RadioButton>
          <RadioButton value="2">Option 2</RadioButton>
          <FieldError>FieldError</FieldError>
        </RadioGroup>
        <RadioGroup isReadOnly defaultValue="1">
          <Label>Readonly</Label>
          <RadioButton value="1">Option 1</RadioButton>
          <RadioButton value="2">Option 2</RadioButton>
        </RadioGroup>
        <RadioGroup defaultValue="2">
          <Label>Option disabled</Label>
          <RadioButton value="1" isDisabled>
            Option 1
          </RadioButton>
          <RadioButton value="2">Option 2</RadioButton>
        </RadioGroup>
      </Flex>,
    );

    await testScreenshot("RadioGroup with RadioButton");
  },
);

test.each(testEnvironments)(
  "RadioGroup interaction (%s)",
  async ({
    testScreenshot,
    render,
    components: { RadioGroup, Radio, Label },
  }) => {
    await render(
      <RadioGroup defaultValue="1">
        <Label>Label</Label>
        <Radio value="1">Option 1</Radio>
        <Radio value="2" data-testid="option">
          Option 2
        </Radio>
      </RadioGroup>,
    );

    const option = page.getByTestId("option");

    await testScreenshot("RadioGroup interaction - default");

    await option.click();

    await testScreenshot("RadioGroup interaction - option selected");
  },
);

test.each(testEnvironments)(
  "RadioGroup edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { RadioGroup, Radio, RadioButton, Label, Text, Content, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <RadioGroup isRequired defaultValue="1">
          <Label>Label</Label>
          <Radio value="1">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star.
          </Radio>
          <Radio value="2">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star.
          </Radio>
        </RadioGroup>
        <RadioGroup isRequired defaultValue="1">
          <Label>Label</Label>
          <RadioButton value="1">
            <Text>Text</Text>
            <Content>Content</Content>
          </RadioButton>
          <RadioButton value="2">
            <Text>
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a blow against the Empire.
            </Text>
            <Content>
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a decisive blow against the Galactic Empire. Rebel spies
              managed to steal secret plans to the Empire's ultimate weapon, the
              Death Star.
            </Content>
          </RadioButton>
        </RadioGroup>
      </Flex>,
    );

    await testScreenshot("RadioGroup edge cases");
  },
);
