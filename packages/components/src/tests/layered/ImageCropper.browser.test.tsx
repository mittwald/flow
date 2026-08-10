import { ImageCropper } from "@/components/ImageCropper";
import { render } from "vitest-browser-react";

/** A local image, so the crop area does not depend on the network. */
const image = `data:image/svg+xml;base64,${btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#888888"/></svg>',
)}`;

/**
 * Resolves a token expression to the value it computes to in the given
 * element's context, so an assertion can name the token instead of hard coding
 * whatever it currently evaluates to.
 */
const resolveColor = (context: Element, value: string) => {
  const probe = document.createElement("div");
  probe.style.color = value;
  context.append(probe);

  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved;
};

const renderCropArea = async () => {
  const dom = await render(<ImageCropper image={image} aspectRatio={1.5} />);
  const cropArea = dom.getByLocator(".reactEasyCrop_CropArea");

  await expect.element(cropArea).toBeInTheDocument();

  return cropArea.element();
};

/*
 * react-easy-crop injects its stylesheet as an unlayered `<style>` element at
 * runtime, with hard coded rgba values for the crop mask and the grid. Those
 * beat anything Flow puts in a cascade layer, so the token based overrides only
 * apply if they leave the layer too.
 */
test("the crop mask uses the design token color", async () => {
  const cropArea = await renderCropArea();

  expect(getComputedStyle(cropArea).color).toBe(
    resolveColor(cropArea, "var(--image-cropper--mask-color)"),
  );
});

test("the crop mask keeps its content box sizing", async () => {
  const cropArea = await renderCropArea();

  expect(getComputedStyle(cropArea).boxSizing).toBe("content-box");
});
