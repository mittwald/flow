import { extractStringFromReactNode } from "./extractStringFromReactNode";
import React from "react";

describe("extractStringFromReactNode function results are strings", () => {
  test("input of type string", () => {
    expect(extractStringFromReactNode("foo")).toMatchInlineSnapshot('"foo"');
  });
  test("input of type number", () => {
    expect(extractStringFromReactNode(100)).toMatchInlineSnapshot('"100"');
  });
  test("input of type boolean", () => {
    expect(extractStringFromReactNode(true)).toMatchInlineSnapshot('"true"');
  });
  test("input of type jsx element", () => {
    expect(extractStringFromReactNode(<div>foo</div>)).toMatchInlineSnapshot(
      '"foo"',
    );
  });
  test("input of type nested jsx element", () => {
    expect(
      extractStringFromReactNode(
        <div>
          <div>foo</div>
        </div>,
      ),
    ).toMatchInlineSnapshot('"foo"');
  });
  test("input of type jsx element without text results in empty string", () => {
    expect(extractStringFromReactNode(<div />)).toMatchInlineSnapshot('""');
  });
  test("input of type jsx element with multiple texts results in empty string", () => {
    expect(
      extractStringFromReactNode(
        <div>
          foo
          <div>foo</div>
          <div>foo</div>
        </div>,
      ),
    ).toMatchInlineSnapshot('""');
  });
  test("null input results in empty string", () => {
    expect(extractStringFromReactNode(null)).toMatchInlineSnapshot('""');
  });
  test("undefined input results in empty string", () => {
    expect(extractStringFromReactNode(undefined)).toMatchInlineSnapshot('""');
  });
  test("jsx input without text results in empty string", () => {
    expect(extractStringFromReactNode(<div></div>)).toMatchInlineSnapshot('""');
  });
});
