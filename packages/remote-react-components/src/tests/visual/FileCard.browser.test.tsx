import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";
import React from "react";

test.each(testEnvironments)(
  "FileCard (%s)",
  async ({
    container,
    render,
    components: {
      Flex,
      FileCard,
      ContextMenu,
      ProgressBar,
      Label,
      Button,
      IconChevronUp,
      IconChevronDown,
    },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        <FileCard name="image.png" />
        <FileCard
          name="image.png"
          type="image/png"
          sizeInBytes={47500}
          onDelete={() => console.log("onDelete")}
        />
        <FileCard name="image.png" imageSrc={gopher}>
          <ContextMenu />
        </FileCard>
        <FileCard>
          <ProgressBar value={20}>
            <Label>Image.png</Label>
          </ProgressBar>
        </FileCard>
        <FileCard name="image.png">
          <Button>
            <IconChevronUp />
          </Button>
          <Button>
            <IconChevronDown />
          </Button>
        </FileCard>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("FileCard");
  },
);
