import { Icon } from "@/components/Icon";
import { dom } from "@fortawesome/fontawesome-svg-core";
import { render } from "vitest-browser-react";

/*
 * FontAwesome's `fontawesome-svg-core` inserts its stylesheet as an unlayered
 * `<style>` element – `autoAddCss` defaults to true, so every consumer of
 * `@mittwald/flow-icons-pro` gets it – and sets `box-sizing: content-box` on
 * `.svg-inline--fa`. Flow needs `border-box` so that the padding it adds stays
 * inside the icon's token size, which only holds in the layered variant if the
 * rule leaves the cascade layer.
 *
 * The icon is a bare `<svg>` rather than an icons-pro component, because the
 * pro icon definitions are not installable in every environment. What matters
 * for the cascade is that the element carries both the library's class and
 * Flow's – exactly what `FontAwesomeIcon` produces – and that the library's
 * stylesheet is the real one.
 */
beforeAll(() => {
  dom.insertCss();
});

test("a FontAwesome icon keeps the border box sizing", async () => {
  const rendered = await render(
    <Icon className="svg-inline--fa">
      <svg />
    </Icon>,
  );
  const icon = rendered.getByLocator(".svg-inline--fa").element();

  expect(getComputedStyle(icon).boxSizing).toBe("border-box");
});
