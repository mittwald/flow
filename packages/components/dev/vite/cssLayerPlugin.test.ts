import { expect, test } from "vitest";
import {
  flowCssLayerName,
  flowCssLayerOrder,
  wrapCssInLayer,
} from "./cssLayerPlugin";

const layerOrder = `@layer ${flowCssLayerOrder.join(", ")};`;

test("wraps CSS in the Flow components layer", () => {
  expect(wrapCssInLayer(".flow--button{display:grid}")).toBe(
    `${layerOrder}@layer ${flowCssLayerName}.components{.flow--button{display:grid}}`,
  );
});

test("keeps charset before the Flow layer order", () => {
  expect(wrapCssInLayer('@charset "UTF-8";.flow--button{}')).toBe(
    `@charset "UTF-8";${layerOrder}@layer ${flowCssLayerName}.components{.flow--button{}}`,
  );
});

test("does not wrap an already layered stylesheet again", () => {
  const css = `${layerOrder}@layer ${flowCssLayerName}.components{.flow--button{}}`;

  expect(wrapCssInLayer(css)).toBe(css);
});

test("qualifies source layers as Flow sublayers", () => {
  expect(
    wrapCssInLayer(
      "@layer reset{.flow--button{all:initial}}@layer base{:root{--size:1rem}}@layer theme{:root{--color:red}}.flow--button{}",
    ),
  ).toBe(
    `${layerOrder}@layer ${flowCssLayerName}.reset{.flow--button{all:initial}}@layer ${flowCssLayerName}.base{:root{--size:1rem}}@layer ${flowCssLayerName}.theme{:root{--color:red}}@layer ${flowCssLayerName}.components{.flow--button{}}`,
  );
});

test("keeps explicitly unlayered source CSS outside Flow layers", () => {
  expect(
    wrapCssInLayer(
      "@layer unlayered{.flow--code-editor .cm-editor{outline:none}}.flow--button{}",
    ),
  ).toBe(
    `${layerOrder}@layer ${flowCssLayerName}.components{.flow--button{}}.flow--code-editor .cm-editor{outline:none}`,
  );
});
