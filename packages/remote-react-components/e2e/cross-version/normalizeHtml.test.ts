import { describe, expect, it } from "vitest";
import { normalizeHtml } from "./normalizeHtml";

describe("normalizeHtml", () => {
  it("removes the hidden connection iframe (identified by visibility:hidden)", () => {
    const input =
      '<button data-testid="btn">ok</button>' +
      '<iframe src="http://localhost:4321/?x=1" ' +
      'style="visibility: hidden; height: 0px; width: 0px;"></iframe>';
    expect(normalizeHtml(input)).toBe('<button data-testid="btn">ok</button>');
  });

  it("KEEPS a real iframe that is not the hidden connection iframe", () => {
    const input =
      '<iframe data-testid="embed" src="https://example.com/" ' +
      'title="Embedded"></iframe>';
    expect(normalizeHtml(input)).toBe(input);
  });

  it("normalizes a generated id to a stable placeholder", () => {
    const input = '<button id="react-aria8683726773-_r_3_">a</button>';
    expect(normalizeHtml(input)).toBe('<button id="GENERATED_ID_1">a</button>');
  });

  it("rewrites a `for` pointing at a generated id to the SAME placeholder as the id", () => {
    const input =
      '<label for="react-aria1-input">Name</label>' +
      '<input id="react-aria1-input" type="text">';
    expect(normalizeHtml(input)).toBe(
      '<label for="GENERATED_ID_1">Name</label>' +
        '<input id="GENERATED_ID_1" type="text">',
    );
  });

  it("gives two different generated ids distinct placeholders, ordered by first appearance", () => {
    const input =
      '<label for=":r2:">A</label><input id=":r2:">' +
      '<label for=":r5:">B</label><input id=":r5:">';
    expect(normalizeHtml(input)).toBe(
      '<label for="GENERATED_ID_1">A</label><input id="GENERATED_ID_1">' +
        '<label for="GENERATED_ID_2">B</label><input id="GENERATED_ID_2">',
    );
  });

  it("normalizes each generated id in a multi-id aria-labelledby, keeping stable tokens", () => {
    const input =
      '<div aria-labelledby="react-aria1 stable-heading :r9:">x</div>';
    expect(normalizeHtml(input)).toBe(
      '<div aria-labelledby="GENERATED_ID_1 stable-heading GENERATED_ID_2">x</div>',
    );
  });

  it("keeps an author-set id/reference that merely CONTAINS a generated-like substring", () => {
    const input =
      '<div id="my-react-aria-wrapper" aria-controls="section_r_data">y</div>';
    expect(normalizeHtml(input)).toBe(input);
  });

  it("keeps id-reference attributes pointing at stable ids unchanged", () => {
    const input = '<input aria-labelledby="my-label">';
    expect(normalizeHtml(input)).toBe(input);
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
      '<label for="react-aria1">x</label><input id="react-aria1">' +
      '<iframe style="visibility: hidden;"></iframe>';
    const once = normalizeHtml(input);
    expect(normalizeHtml(once)).toBe(once);
  });
});
