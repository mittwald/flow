import { describe, expect, test } from "vitest";
import { usePropsForRemoteElement } from "@mittwald/remote-dom-react/host";

/*
 * Covers our patch to `@mittwald/remote-dom-react` (see `patches/`). Upstream
 * passes `children: []` to every host component, even one rendered without
 * children, where a component rendered locally gets `undefined`.
 */

type Element = Parameters<typeof usePropsForRemoteElement>[0];
type Options = Parameters<typeof usePropsForRemoteElement>[1];

const element = (children: unknown[]) =>
  ({
    id: "1",
    type: 1,
    element: "flr-test",
    version: 0,
    children,
    properties: { value: 1 },
    attributes: {},
    eventListeners: {},
  }) as unknown as Element;

const options = {
  receiver: {},
  components: new Map(),
} as unknown as Options;

describe("usePropsForRemoteElement", () => {
  test("passes no children for an element without children", () => {
    expect(usePropsForRemoteElement(element([]), options)).toEqual({
      value: 1,
    });
  });

  test("passes the rendered children", () => {
    const text = { id: "2", type: 3, data: "text", version: 0 };
    const props = usePropsForRemoteElement(element([text]), options) as {
      children: unknown[];
    };
    expect(props.children).toHaveLength(1);
  });
});
