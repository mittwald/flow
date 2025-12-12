import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "Label (%s)",
  async ({
    container,
    render,
    components: {
      Flex,
      Label,
      Text,
      Button,
      ContextualHelpTrigger,
      ContextualHelp,
    },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        <Label>Label</Label>
        <Label optional>Label</Label>
        <Label>
          <Text>Label</Text>
          <Button>Button</Button>
        </Label>
        <Label>
          <Text>Label</Text>
          <ContextualHelpTrigger>
            <Button />
            <ContextualHelp />
          </ContextualHelpTrigger>
        </Label>
        <Label optional>
          <Text>Label</Text>
          <ContextualHelpTrigger>
            <Button />
            <ContextualHelp />
          </ContextualHelpTrigger>
        </Label>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Label");
  },
);
