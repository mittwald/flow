import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";
import { userEvent } from "vitest/browser";

// ImageCropper is available from alpha.791.
test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
  "ImageCropper variants (%s)",
  async ({ testScreenshot, render, components: { ImageCropper, Flex } }) => {
    await render(
      <Flex gap="m">
        <ImageCropper image={gopher} height={200} width={200} />
        <ImageCropper image={gopher} aspectRatio={16 / 9} height={200} />
        <ImageCropper
          image={gopher}
          aspectRatio={1}
          cropShape="round"
          height={200}
          width={200}
        />
      </Flex>,
    );

    await testScreenshot("ImageCropper variants");
  },
);

/*
 * An image the test server answers with 404. Only the `image` prop is involved,
 * so an old remote version renders the same host output as the current one.
 */
const brokenImage = "/this-image-does-not-exist.png";

test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
  "ImageCropper load error (%s)",
  async ({ testScreenshot, render, components: { ImageCropper } }) => {
    await render(<ImageCropper image={brokenImage} height={200} width={200} />);

    await testScreenshot("ImageCropper load error");
  },
);

// errorView is available from 1.0.16.
test.skipIf(crossVersion({ below: "1.0.16" })).each(testEnvironments)(
  "ImageCropper custom error view (%s)",
  async ({
    testScreenshot,
    render,
    components: { ImageCropper, IllustratedMessage, IconDanger, Heading, Text },
  }) => {
    await render(
      <ImageCropper
        image={brokenImage}
        height={200}
        width={200}
        errorView={
          <IllustratedMessage color="danger">
            <IconDanger />
            <Heading>Bild nicht verfügbar</Heading>
            <Text>Bitte lade das Bild erneut hoch.</Text>
          </IllustratedMessage>
        }
      />,
    );

    await testScreenshot("ImageCropper custom error view");
  },
);

test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
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
