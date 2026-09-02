import Markdown from "@/components/Markdown";
import { render } from "vitest-browser-react";

const markdownOf = (dom: { container: HTMLElement }) =>
  dom.container.querySelector(".flow--markdown");

test("Markdown drops disallowed elements instead of putting the option on the DOM", async () => {
  const dom = await render(
    <Markdown disallowedElements={["img"]}>
      {`Text ![alt](https://example.com/a.png)`}
    </Markdown>,
  );
  const markdown = markdownOf(dom);

  expect(markdown?.querySelector("img")).toBeNull();
  expect(markdown?.getAttribute("disallowedelements")).toBeNull();
});

test("Markdown unwraps disallowed elements when asked to", async () => {
  const dom = await render(
    <Markdown disallowedElements={["em"]} unwrapDisallowed>
      {`a *word*`}
    </Markdown>,
  );
  const markdown = markdownOf(dom);

  expect(markdown?.querySelector("em")).toBeNull();
  expect(markdown?.textContent).toContain("word");
});

test("Markdown honours allowedElements", async () => {
  const dom = await render(
    <Markdown allowedElements={["p"]}>{`a *word*`}</Markdown>,
  );

  expect(markdownOf(dom)?.querySelector("em")).toBeNull();
});
