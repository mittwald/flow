import type { FC } from "react";
import { describe, expect, test } from "vitest";
import { removeSpaceAfterTaskListCheckbox } from "./removeSpaceAfterTaskListCheckbox";

/* react-markdown hands every renderer its hast node. */
const Input: FC<{ node: { tagName: string } }> = () => null;
const checkbox = <Input key="input" node={{ tagName: "input" }} />;

describe("removeSpaceAfterTaskListCheckbox", () => {
  test("removes the space that follows the checkbox", () => {
    const [, text] = removeSpaceAfterTaskListCheckbox([
      checkbox,
      " Zone exportieren",
    ]);

    expect(text).toBe("Zone exportieren");
  });

  test("keeps spaces that follow no checkbox", () => {
    expect(removeSpaceAfterTaskListCheckbox([" Zone exportieren"])).toEqual([
      " Zone exportieren",
    ]);
  });
});
