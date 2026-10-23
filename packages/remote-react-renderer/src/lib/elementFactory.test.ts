import { elementFactory } from "@/lib/elementFactory";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

const render = (props: Record<string, unknown>) =>
  renderToStaticMarkup(elementFactory("svg")({ className: "icon", ...props }));

describe("elementFactory", () => {
  test("drops a style string", () => {
    expect(render({ style: "width: 16px" })).toBe('<svg class="icon"></svg>');
  });

  test("hides an element suspended by React", () => {
    expect(render({ style: "display: none !important;" })).toBe(
      '<svg class="icon" style="display:none"></svg>',
    );
  });

  test("hides a suspended element with an inline style", () => {
    expect(render({ style: "width: 16px; display: none !important;" })).toBe(
      '<svg class="icon" style="display:none"></svg>',
    );
  });

  test("keeps a style object", () => {
    expect(render({ style: { width: 16 } })).toBe(
      '<svg class="icon" style="width:16px"></svg>',
    );
  });
});
