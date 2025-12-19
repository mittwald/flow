import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";

test.each(testEnvironments)(
  "FileCard variants (%s)",
  async ({
    testScreenshot,
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
          href="#"
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

    await testScreenshot("FileCard variants");
  },
);

test.each(testEnvironments)(
  "FileCard edge cases (%s)",
  async ({ testScreenshot, render, components: { FileCard, Flex } }) => {
    await render(
      <Flex gap="m" direction="column">
        <FileCard
          name="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas."
        />
        <FileCard
          name="Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas."
          onDelete={() => console.log("onDelete")}
        />
      </Flex>,
    );

    await testScreenshot("FileCard edge cases");
  },
);
