import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";
import logo from "@/tests/assets/mittwald_logo_landscape.jpg";

test.each(testEnvironments)(
  "Image (%s)",
  async ({ testScreenshot, render, components: { Image, Flex } }) => {
    await render(
      <Flex gap="s" align="center">
        <Image alt="Gopher" src={gopher} width={200} />
        <Image alt="Gopher" src={gopher} width={200} withBorder />
        <Image
          alt="Gopher"
          src={gopher}
          width={200}
          withBorder
          withRoundedCorners={false}
        />
        <Image alt="Gopher" src={gopher} width={200} aspectRatio={16 / 9} />
      </Flex>,
    );

    await testScreenshot("Image");
  },
);

test.each(testEnvironments)(
  "Image in a column (%s)",
  async ({
    testScreenshot,
    render,
    components: { Image, ColumnLayout, Flex },
  }) => {
    await render(
      <ColumnLayout columnGap="xl" m={[1, 1]} l={[1, 1]}>
        <Flex direction="column">
          <Image alt="Narrower than its column" src={gopher} />
        </Flex>
        <Flex direction="column">
          <Image alt="Wider than its column" src={logo} />
        </Flex>
      </ColumnLayout>,
    );

    await testScreenshot("Image in a column");
  },
);
