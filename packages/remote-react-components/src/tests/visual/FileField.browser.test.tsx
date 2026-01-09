import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { useState } from "react";

test.each(testEnvironments)(
  "FileField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      Label,
      FileField,
      Button,
      FieldDescription,
      FieldError,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <FileField name="file">
          <Label>Default</Label>
          <Button>Select file</Button>
          <FieldDescription>FieldDescription</FieldDescription>
        </FileField>
        <FileField name="file" isInvalid>
          <Label>Invalid</Label>
          <Button>Select file</Button>
          <FieldError>FieldError</FieldError>
        </FileField>
        <FileField name="file" isDisabled>
          <Label>Disabled</Label>
          <Button>Select file</Button>
        </FileField>
        <FileField name="file" isReadOnly>
          <Label>Readonly</Label>
          <Button>Select file</Button>
        </FileField>
      </Flex>,
    );

    await testScreenshot("FileField states");
  },
);

test.each(testEnvironments)(
  "FileField upload one (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, FileField, Section, Button },
  }) => {
    function Wrapper() {
      const [files, setFiles] = useState<FileList | null>(null);
      const file = files?.[0];

      return (
        <Section>
          <FileField data-testid="field" onChange={setFiles}>
            <Button>Select file</Button>
          </FileField>
          <Text>{file?.name}</Text>
        </Section>
      );
    }

    await render(<Wrapper />);

    await testScreenshot("FileField upload one - default");

    const field = page.getByTestId("field");
    await userEvent.upload(field, "src/tests/assets/gopher.webp");

    await testScreenshot("FileField upload one - uploaded ");
  },
);

test.each(testEnvironments)(
  "FileField upload multiple (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, FileField, Section, Button },
  }) => {
    function Wrapper() {
      const [files, setFiles] = useState<FileList | null>(null);
      const file = files?.[0];
      const secondFile = files?.[1];

      return (
        <Section>
          <FileField multiple data-testid="field" onChange={setFiles}>
            <Button>Select file</Button>
          </FileField>
          <Text>
            {file?.name} {secondFile?.name}
          </Text>
        </Section>
      );
    }

    await render(<Wrapper />);

    await testScreenshot("FileField upload multiple - default");

    const field = page.getByTestId("field");
    await userEvent.upload(field, [
      "src/tests/assets/gopher.webp",
      "src/tests/assets/gopher.webp",
    ]);

    await testScreenshot("FileField upload multiple - uploaded");
  },
);
