import { describe, expect, it } from "vitest";
import { normalizeHtml } from "./normalizeHtml";

describe("normalizeHtml", () => {
  it("removes the hidden connection iframe (with children)", () => {
    const input =
      '<button data-testid="btn">ok</button>' +
      '<iframe src="http://localhost:6099/?x=1" style="visibility:hidden">' +
      "</iframe>";
    expect(normalizeHtml(input)).toBe('<button data-testid="btn">ok</button>');
  });

  it("removes a self-closing hidden connection iframe", () => {
    const input = '<span>hi</span><iframe src="x" />';
    expect(normalizeHtml(input)).toBe("<span>hi</span>");
  });

  it("drops generated id attributes but keeps semantic ids", () => {
    const input =
      '<button id="react-aria8683726773-_r_3_">a</button>' +
      '<label id=":r5:">b</label>' +
      '<div id="my-stable-id">c</div>';
    expect(normalizeHtml(input)).toBe(
      '<button>a</button><label>b</label><div id="my-stable-id">c</div>',
    );
  });

  it("drops id-reference attributes pointing at generated ids", () => {
    const input =
      '<input aria-labelledby="react-aria123-label" ' +
      'aria-describedby=":r7:" for="react-aria9" />';
    expect(normalizeHtml(input)).toBe("<input />");
  });

  it("keeps id-reference attributes pointing at stable ids", () => {
    const input = '<input aria-labelledby="my-label" />';
    expect(normalizeHtml(input)).toBe('<input aria-labelledby="my-label" />');
  });

  it("removes data-flr-version and data-flr-initialized", () => {
    const input =
      '<div data-flr-version="0.2.0-alpha.883" data-flr-initialized="true" ' +
      'class="flow--x">y</div>';
    expect(normalizeHtml(input)).toBe('<div class="flow--x">y</div>');
  });

  it("keeps semantic attributes and text content", () => {
    const input =
      '<button data-testid="b" class="flow--button flow--button--primary" ' +
      'type="button" disabled="" aria-disabled="true" ' +
      'data-react-aria-pressable="true">Click me</button>';
    expect(normalizeHtml(input)).toBe(input);
  });

  it("collapses insignificant whitespace between tags", () => {
    const input = "<div>\n  <span>  a  </span>\n</div>";
    expect(normalizeHtml(input)).toBe("<div><span>  a  </span></div>");
  });

  it("is idempotent", () => {
    const input =
      '<button id="react-aria1" data-testid="b">x</button>' +
      '<iframe src="y"></iframe>';
    const once = normalizeHtml(input);
    expect(normalizeHtml(once)).toBe(once);
  });
});
