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
