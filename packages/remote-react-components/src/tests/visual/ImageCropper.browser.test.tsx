import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";

test.each(testEnvironments)(
  "ImageCropper variants (%s)",
  async ({ testScreenshot, render, components: { ImageCropper, Flex } }) => {
    await render(
      <Flex gap="m">
        <ImageCropper image={gopher} height={200} width={200} />
        <ImageCropper image={gopher} aspect={16 / 9} height={200} />
        <ImageCropper
          image={gopher}
          aspect={1}
          cropShape="round"
          height={200}
          width={200}
        />
      </Flex>,
    );

    await testScreenshot("ImageCropper variants");
  },
);
