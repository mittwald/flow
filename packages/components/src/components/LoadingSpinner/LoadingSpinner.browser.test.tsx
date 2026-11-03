import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { createRef } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { IllustratedMessage } from "@/components/IllustratedMessage";
import { PropsContextProvider } from "@/lib/propsContext";
import iconStyles from "@/components/Icon/Icon.module.scss";
import spinnerStyles from "./LoadingSpinner.module.scss";

const svg = () => {
  const element = document.querySelector("svg");
  if (!element) {
    throw new Error("no svg rendered");
  }
  return element;
};

test("a consumer ref reaches the svg and the phase offset is still set", async () => {
  const ref = createRef<HTMLDivElement>();
  await render(<LoadingSpinner ref={ref} />);

  expect(ref.current).toBe(svg());
  expect(svg().style.getPropertyValue("--animation-delay")).toMatch(/ms$/);
});

/* `type: "layout"`: the spinner stands in for an icon. */
test("an Icon props context (IllustratedMessage) reaches the inner icon", async () => {
  await render(
    <IllustratedMessage>
      <LoadingSpinner />
    </IllustratedMessage>,
  );

  expect(svg().classList).toContain(iconStyles["size-l"]);
});

test("a LoadingSpinner props context reaches the spinner", async () => {
  await render(
    <PropsContextProvider props={{ LoadingSpinner: { color: "light" } }}>
      <LoadingSpinner />
    </PropsContextProvider>,
  );

  expect(svg().classList).toContain(spinnerStyles.light);
});
