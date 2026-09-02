import type { FC } from "react";
import { describe, expect, test } from "vitest";
import { extractTextFromChildren, extractTextFromFirstChild } from "./remote";

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

/**
 * The narrow helper stays as it is: `Button`, `Markdown`, `Initials` and
 * `Truncate` all depend on "the children are exactly one text node" rather than
 * "the children contain text somewhere".
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
