import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { Image } from "@/components/Image";

const src =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='10'%3E%3C/svg%3E";

const imageOf = (container: Element): HTMLImageElement =>
  container.querySelector("img") as HTMLImageElement;

test("keeps sizing from style when no size props are given", async () => {
  const screen = await render(
    <Image alt="" src={src} style={{ width: "100%", height: "50%" }} />,
  );

  const image = imageOf(screen.container);

  expect(image.style.width).toBe("100%");
  expect(image.style.height).toBe("50%");
});

test("prefers the size props over style", async () => {
  const screen = await render(
    <Image alt="" src={src} style={{ width: "100%" }} width={120} />,
  );

  expect(imageOf(screen.container).style.width).toBe("120px");
});

test("keeps aspectRatio from style when no aspectRatio prop is given", async () => {
  const screen = await render(
    <Image alt="" src={src} style={{ aspectRatio: "16 / 9" }} />,
  );

  expect(imageOf(screen.container).style.aspectRatio).toBe("16 / 9");
});
