import type { FC } from "react";
import { describe, expect, test } from "vitest";
import {
  containsTextChild,
  extractTextFromChildren,
  extractTextFromFirstChild,
} from "./remote";

/**
 * Stands in for `RemoteTextRenderer`: remotely, a text node arrives as an
 * element carrying the text in `props.remote.data`.
 */
const RemoteText: FC<{ remote: { data: string } }> = () => null;
const remoteText = (data: string) => <RemoteText remote={{ data }} />;

const Badge: FC<{ children?: string }> = () => null;

describe("extractTextFromChildren()", () => {
  test("returns a single text child", () => {
    expect(extractTextFromChildren("X-Wing")).toBe("X-Wing");
  });

  test("returns the text of mixed children, ignoring the element", () => {
    expect(
      extractTextFromChildren(
        <>
          Millennium Falcon <Badge>Latest</Badge>
        </>,
      ),
    ).toBe("Millennium Falcon");
  });

  test("ignores text nested inside an element child", () => {
    expect(extractTextFromChildren(<Badge>Latest</Badge>)).toBeUndefined();
  });

  test("joins several text children", () => {
    expect(extractTextFromChildren(["Millennium", " ", "Falcon"])).toBe(
      "Millennium Falcon",
    );
  });

  test("keeps text between elements", () => {
    expect(
      extractTextFromChildren(
        <>
          <Badge>a</Badge>
          Millennium Falcon
          <Badge>b</Badge>
        </>,
      ),
    ).toBe("Millennium Falcon");
  });

  test("reads a number child", () => {
    expect(extractTextFromChildren(42)).toBe("42");
  });

  test("reads a remote text child", () => {
    expect(extractTextFromChildren(remoteText("X-Wing"))).toBe("X-Wing");
  });

  test("reads remote text mixed with an element", () => {
    expect(
      extractTextFromChildren([
        remoteText("Millennium Falcon "),
        <Badge key="badge" />,
      ]),
    ).toBe("Millennium Falcon");
  });

  test("joins several remote text children", () => {
    expect(
      extractTextFromChildren([
        remoteText("Millennium"),
        remoteText(" Falcon"),
      ]),
    ).toBe("Millennium Falcon");
  });

  test("looks through a fragment", () => {
    expect(
      extractTextFromChildren(
        <>
          <>Millennium Falcon</>
        </>,
      ),
    ).toBe("Millennium Falcon");
  });

  test.each([[undefined], [null], [false], [""], ["   "], [[]]])(
    "returns undefined for %p",
    (children) => {
      expect(extractTextFromChildren(children)).toBeUndefined();
    },
  );
});

describe("containsTextChild()", () => {
  test("is true for a text child", () => {
    expect(containsTextChild("X-Wing")).toBe(true);
  });

  test("is true for text next to an element", () => {
    expect(
      containsTextChild(
        <>
          Millennium Falcon <Badge>Latest</Badge>
        </>,
      ),
    ).toBe(true);
  });

  test("is false when only an element child carries text", () => {
    expect(containsTextChild(<Badge>Latest</Badge>)).toBe(false);
  });

  test("is true for a number child", () => {
    expect(containsTextChild(42)).toBe(true);
  });

  test("is true for a remote text child", () => {
    expect(containsTextChild(remoteText("X-Wing"))).toBe(true);
  });

  test("looks through a fragment", () => {
    expect(
      containsTextChild(
        <>
          <>Millennium Falcon</>
        </>,
      ),
    ).toBe(true);
  });

  /**
   * Whitespace is not a label. `Button` reads this to decide whether it lays
   * out as icon-only, and a blank string should not push it into the labelled
   * layout with nothing to show.
   */
  test.each([[undefined], [null], [false], [""], ["   "], [[]]])(
    "is false for %p",
    (children) => {
      expect(containsTextChild(children)).toBe(false);
    },
  );
});

/**
 * The narrow helper stays as it is: `Markdown`, `Initials` and `Truncate` all
 * depend on "the children are exactly one text node" rather than "the children
 * contain text somewhere".
 */
describe("extractTextFromFirstChild()", () => {
  test("returns a single text child", () => {
    expect(extractTextFromFirstChild("X-Wing")).toBe("X-Wing");
  });

  test("returns a single remote text child", () => {
    expect(extractTextFromFirstChild(remoteText("X-Wing"))).toBe("X-Wing");
  });

  test("returns undefined for mixed children", () => {
    expect(
      extractTextFromFirstChild(
        <>
          Millennium Falcon <Badge>Latest</Badge>
        </>,
      ),
    ).toBeUndefined();
  });

  test("returns undefined for a single element child", () => {
    expect(extractTextFromFirstChild(<Badge>Latest</Badge>)).toBeUndefined();
  });
});
