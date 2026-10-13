import Button from "@/components/Button/Button";
import Skeleton from "@/components/Skeleton/Skeleton";
import SkeletonText from "@/components/SkeletonText/SkeletonText";
import { render } from "vitest-browser-react";
import { commands, page } from "vitest/browser";

test("animation duration is 0 when prefers-reduced-motion is set", async () => {
  await render(<Button />);
  const button = page.getByRole("button");
  expect(button).toHaveStyle({
    animationDuration: "0s",
  });
});

const infinitePseudoElementAnimations = () =>
  document
    .getAnimations()
    .filter(
      (animation) =>
        animation.effect instanceof KeyframeEffect &&
        animation.effect.pseudoElement !== null &&
        animation.effect.getTiming().iterations === Infinity,
    )
    .map((animation) => (animation as CSSAnimation).animationName);

const renderSkeletons = async () => {
  const screen = await render(
    <>
      <Skeleton width={200} height={40} />
      <SkeletonText width={200} />
    </>,
  );
  expect(screen.container.querySelectorAll("[aria-hidden]")).toHaveLength(2);
};

describe("::before and ::after animations", () => {
  afterEach(() => commands.setReducedMotion("reduce"));

  test("run when motion is allowed", async () => {
    await commands.setReducedMotion("no-preference");
    await renderSkeletons();

    await expect.poll(infinitePseudoElementAnimations).toHaveLength(2);
  });

  test("stop when prefers-reduced-motion is set", async () => {
    await renderSkeletons();
    await new Promise(requestAnimationFrame);

    expect(infinitePseudoElementAnimations()).toEqual([]);
  });
});
