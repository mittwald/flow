import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "FileDropZone states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, FileDropZone, IconUpload, Heading, FileField, Button },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <FileDropZone>
          <IconUpload />
          <Heading>Default</Heading>
          <FileField name="file">
            <Button>Select file</Button>
          </FileField>
        </FileDropZone>
        <FileDropZone isDisabled>
          <IconUpload />
          <Heading>Disabled</Heading>
          <FileField name="file">
            <Button>Select file</Button>
          </FileField>
        </FileDropZone>
      </Flex>,
    );

    await testScreenshot("FileDropZone states");
  },
);

// The error renders below the drop zone, like in every other field.
test.each(testEnvironments)(
  "FileDropZone with FieldError (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      FileDropZone,
      IconUpload,
      Heading,
      FileField,
      Button,
      FieldError,
    },
  }) => {
    await render(
      <FileDropZone>
        <IconUpload />
        <Heading>Upload certificate</Heading>
        <FileField name="file">
          <Button>Select file</Button>
        </FileField>
        <FieldError>The file is too large</FieldError>
      </FileDropZone>,
    );

    await testScreenshot("FileDropZone with FieldError");
  },
);
