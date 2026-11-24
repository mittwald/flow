import Button from "@/components/Button/Button";
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

const pseudoElementAnimationStyles = `
  @keyframes pseudo-element-pulse {
    to {
      opacity: 0;
    }
  }

  .pseudo-element-animation::before,
  .pseudo-element-animation::after {
    content: "";
    animation: pseudo-element-pulse 1s infinite;
  }
`;

const renderPseudoElementAnimations = async () => {
  const screen = await render(
    <>
      <style>{pseudoElementAnimationStyles}</style>
      <div className="pseudo-element-animation" />
    </>,
  );
  expect(
    screen.container.querySelector(".pseudo-element-animation"),
  ).not.toBeNull();
};

describe("::before and ::after animations", () => {
  afterEach(() => commands.setReducedMotion("reduce"));

  test("run when motion is allowed", async () => {
    await commands.setReducedMotion("no-preference");
    await renderPseudoElementAnimations();

    await expect.poll(infinitePseudoElementAnimations).toHaveLength(2);
  });

  test("stop when prefers-reduced-motion is set", async () => {
    await renderPseudoElementAnimations();
    await new Promise(requestAnimationFrame);

    expect(infinitePseudoElementAnimations()).toEqual([]);
  });
});
