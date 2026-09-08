import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import {
  ImageCropper,
  type ImageCropperError,
} from "@/components/ImageCropper";
import { getCroppedImageFile } from "@/components/ImageCropper/lib/getCroppedImageFile";

/** Base64 that does not decode to a PNG, so the browser fails to load it. */
const brokenImage = "data:image/png;base64,bm90LWEtcG5n";

const defaultErrorText = "The image could not be loaded.";

const createImage = (): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;

  const ctx = canvas.getContext("2d");
  ctx?.fillRect(0, 0, 100, 100);

  return canvas.toDataURL("image/png");
};

test("An image that cannot be loaded renders the error view and reports it", async () => {
  const errors: ImageCropperError[] = [];

  render(
    <ImageCropper
      image={brokenImage}
      onError={(error) => errors.push(error)}
    />,
  );

  await expect.element(page.getByText(defaultErrorText)).toBeInTheDocument();

  expect(errors).toEqual([
    { reason: "load", message: `Failed to load image "${brokenImage}"` },
  ]);

  // There is nothing left to zoom into.
  expect(page.getByRole("slider").query()).toBeNull();
});

test("errorView replaces the default error message", async () => {
  render(
    <ImageCropper image={brokenImage} errorView={<span>Custom error</span>} />,
  );

  await expect.element(page.getByText("Custom error")).toBeInTheDocument();
  expect(page.getByText(defaultErrorText).query()).toBeNull();
});

/*
 * The reported defect: reading the loaded image failed and the rejection was
 * left unhandled, with nothing shown to the user and nothing for the app to
 * react to. Cropping a cross-origin image without CORS headers is the real
 * world case; a canvas without a 2d context fails the same way, deterministically.
 */
test("An image that cannot be cropped renders the error view and reports it", async () => {
  const image = createImage();
  const errors: ImageCropperError[] = [];
  const unhandledRejections: unknown[] = [];
  const collectRejection = (event: PromiseRejectionEvent): void => {
    unhandledRejections.push(event.reason);
  };

  window.addEventListener("unhandledrejection", collectRejection);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

  try {
    render(
      <ImageCropper image={image} onError={(error) => errors.push(error)} />,
    );

    await expect.element(page.getByText(defaultErrorText)).toBeInTheDocument();

    expect(errors).toEqual([
      { reason: "crop", message: "Failed to get canvas context" },
    ]);
    expect(unhandledRejections).toEqual([]);
  } finally {
    window.removeEventListener("unhandledrejection", collectRejection);
    vi.restoreAllMocks();
  }
});

test("An image that cannot be loaded rejects instead of staying pending", async () => {
  await expect(
    getCroppedImageFile(brokenImage, "", { x: 0, y: 0, width: 10, height: 10 }),
  ).rejects.toThrow("Failed to load image");
});
