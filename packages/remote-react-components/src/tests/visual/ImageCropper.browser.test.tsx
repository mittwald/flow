import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";
import { userEvent } from "vitest/browser";

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

test.each(testEnvironments)(
  "ImageCropper interaction (%s)",
  async ({ testScreenshot, render, components: { ImageCropper } }) => {
    await render(<ImageCropper image={gopher} />);

    await testScreenshot("ImageCropper interaction - default");

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{arrowDown}");
    await userEvent.keyboard("{arrowDown}");

    await testScreenshot("ImageCropper interaction - position changed");

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{arrowRight}");
    await userEvent.keyboard("{arrowRight}");
    await userEvent.keyboard("{arrowRight}");

    await testScreenshot("ImageCropper interaction - zoom changed");
  },
);
