import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { Time } from "@internationalized/date";

test.each(testEnvironments)(
  "TimeField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      TimeField,
      Label,
      FieldError,
      FieldDescription,
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <TimeField isRequired defaultValue={new Time(11, 45)}>
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </TimeField>
        <TimeField isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </TimeField>
        <TimeField isReadOnly>
          <Label>Readonly</Label>
        </TimeField>
        <TimeField isDisabled>
          <Label>Disabled</Label>
        </TimeField>
        <TimeField granularity="hour">
          <Label>Hour only</Label>
        </TimeField>
      </Flex>,
    );

    await testScreenshot("TimeField states");
  },
);
