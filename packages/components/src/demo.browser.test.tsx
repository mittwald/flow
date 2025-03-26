import Button from "@/components/Button";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

test("renders name", async () => {
  const { getByText } = render(<Button>Click me</Button>);
  await expect.element(getByText("Click me!")).toBeInTheDocument();
});
