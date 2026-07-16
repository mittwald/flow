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
        <FileCard name="x-wing.png" />
        <FileCard
          name="millennium-falcon.png"
          type="image/png"
          sizeInBytes={47500}
          onDelete={() => console.log("onDelete")}
          href="#"
        />
        <FileCard name="tatooine-sunset.png" imageSrc={gopher}>
          <ContextMenu />
        </FileCard>
        <FileCard>
          <ProgressBar value={20}>
            <Label>tie-fighter.png</Label>
          </ProgressBar>
        </FileCard>
        <FileCard name="endor-forest.png">
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
          name="A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies stole secret
          plans to the Empire's ultimate weapon, the Death Star, an armored space
          station."
        />
        <FileCard
          name="A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies stole secret
          plans to the Empire's ultimate weapon, the Death Star, an armored space
          station."
          onDelete={() => console.log("onDelete")}
        />
      </Flex>,
    );

    await testScreenshot("FileCard edge cases");
  },
);
