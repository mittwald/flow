import Button from "@/components/Button/Button";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

test("animation duration is 0 when prefers-reduced-motion is set", async () => {
  await render(<Button />);
  const button = page.getByRole("button");
  expect(button).toHaveStyle({
    animationDuration: "0s",
  });
});
