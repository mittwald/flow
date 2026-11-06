import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { AlertIcon } from "@/components/AlertIcon";
import { AlertText } from "@/components/AlertText";
import { PropsContextProvider } from "@/lib/propsContext";
import iconStyles from "@/components/Icon/Icon.module.scss";

const svg = () => {
  const element = document.querySelector("svg");
  if (!element) {
    throw new Error("no svg rendered");
  }
  return element;
};

/* `type: "layout"`: the alert icon stands in for an icon. */
test("an Icon props context (AlertText) reaches the inner icon", async () => {
  await render(<AlertText>Text</AlertText>);

  expect(svg().classList).toContain(iconStyles["size-s"]);
});

test("an AlertIcon props context reaches the alert icon", async () => {
  await render(
    <PropsContextProvider props={{ AlertIcon: { className: "from-context" } }}>
      <AlertIcon />
    </PropsContextProvider>,
  );

  expect(svg().classList).toContain("from-context");
});
