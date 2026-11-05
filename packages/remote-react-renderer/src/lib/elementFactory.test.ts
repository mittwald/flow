import { elementFactory } from "@/lib/elementFactory";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";

const render = (props: Record<string, unknown>) =>
  renderToStaticMarkup(elementFactory("svg")({ className: "icon", ...props }));

describe("elementFactory", () => {
  test("ignores props that are not component props", () => {
    expect(render({ dangerouslySetInnerHTML: { __html: "<b>x</b>" } })).toBe(
      '<svg class="icon"></svg>',
    );
  });

  test("ignores lower-cased props that are not component props", () => {
    expect(render({ dangerouslysetinnerhtml: { __html: "<b>x</b>" } })).toBe(
      '<svg class="icon"></svg>',
    );
  });

  test("ignores non-function event handlers", () => {
    const element = elementFactory("svg")({
      className: "icon",
      onClick: "click",
    });

    expect(element.props).not.toHaveProperty("onClick");
  });

  test("keeps function event handlers", () => {
    const onClick = () => undefined;
    const element = elementFactory("svg")({ className: "icon", onClick });

    expect(element.props).toHaveProperty("onClick", onClick);
  });

  test("ignores ref and key props", () => {
    const element = elementFactory("svg")({
      className: "icon",
      ref: "remote-ref",
      key: "remote-key",
    });

    expect(element.props).not.toHaveProperty("ref");
    expect(element.key).toBeNull();
  });

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
