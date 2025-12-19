import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";

test.each(testEnvironments)(
  "Image (%s)",
  async ({ testScreenshot, render, components: { Image, Flex } }) => {
    await render(
      <Flex gap="s" align="center">
        <Image alt="Gopher" src={gopher} width={200} />
        <Image alt="Gopher" src={gopher} width={200} withBorder />
        <Image alt="Gopher" src={gopher} width={200} aspectRatio={16 / 9} />
      </Flex>,
    );

    await testScreenshot("Image");
  },
);
