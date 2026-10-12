import { describe, expect, test, vi } from "vitest";
import type { DropItem, FileDropItem } from "@react-types/shared";
import { getAcceptedFiles, matchesAccept } from "@/lib/files/acceptedFiles";

const file = (name: string, type: string) => ({ name, type });

describe("matchesAccept", () => {
  test.each([undefined, "", "   "])("takes everything for %o", (accept) => {
    expect(matchesAccept(file("notes.txt", "text/plain"), accept)).toBe(true);
  });

  test("matches an exact MIME type", () => {
    expect(matchesAccept(file("a.png", "image/png"), "image/png")).toBe(true);
    expect(matchesAccept(file("a.gif", "image/gif"), "image/png")).toBe(false);
  });

  test("matches a MIME wildcard", () => {
    expect(matchesAccept(file("a.png", "image/png"), "image/*")).toBe(true);
    expect(matchesAccept(file("a.pdf", "application/pdf"), "image/*")).toBe(
      false,
    );
  });

  test("matches a file extension", () => {
    expect(matchesAccept(file("archive.tar.gz", ""), ".gz")).toBe(true);
    expect(matchesAccept(file("archive.zip", ""), ".gz")).toBe(false);
  });

  test("matches any token of the list", () => {
    const accept = "image/*, .pdf, text/csv";

    expect(matchesAccept(file("a.png", "image/png"), accept)).toBe(true);
    expect(matchesAccept(file("a.pdf", "application/pdf"), accept)).toBe(true);
    expect(matchesAccept(file("a.csv", "text/csv"), accept)).toBe(true);
    expect(matchesAccept(file("a.docx", "application/msword"), accept)).toBe(
      false,
    );
  });

  test("ignores case on both sides", () => {
    expect(matchesAccept(file("A.PNG", "IMAGE/PNG"), "image/png")).toBe(true);
    expect(matchesAccept(file("A.PNG", "IMAGE/PNG"), ".png")).toBe(true);
  });

  /*
   * A file the browser has no type for can still be matched by its extension —
   * which is the only reason the extension form exists.
   */
  test("matches an untyped file by extension only", () => {
    expect(matchesAccept(file("script.sh", ""), "image/*")).toBe(false);
    expect(matchesAccept(file("script.sh", ""), ".sh")).toBe(true);
  });
});

const fileDropItem = (
  name: string,
  type: string,
  getFile = async () => new File(["content"], name, { type }),
): FileDropItem => ({
  kind: "file",
  name,
  type,
  getFile,
  getText: async () => "",
});

describe("getAcceptedFiles", () => {
  test("reads the files accept covers", async () => {
    const files = await getAcceptedFiles(
      [
        fileDropItem("cat.png", "image/png"),
        fileDropItem("notes.txt", "text/plain"),
      ],
      "image/*",
    );

    expect(files.map((file) => file.name)).toEqual(["cat.png"]);
  });

  test("reads every file without an accept list", async () => {
    const files = await getAcceptedFiles([
      fileDropItem("cat.png", "image/png"),
      fileDropItem("notes.txt", "text/plain"),
    ]);

    expect(files.map((file) => file.name)).toEqual(["cat.png", "notes.txt"]);
  });

  test("skips an item that is not a file", async () => {
    const draggedText = {
      kind: "text",
      types: new Set(["text/plain"]),
      getText: async () => "dragged text",
    } as DropItem;

    expect(await getAcceptedFiles([draggedText])).toEqual([]);
  });

  // The filter runs on the drop item, so a rejected file is never read at all.
  test("does not read a file accept rejects", async () => {
    const getFile = vi.fn(
      async () => new File(["content"], "notes.txt", { type: "text/plain" }),
    );

    await getAcceptedFiles(
      [fileDropItem("notes.txt", "text/plain", getFile)],
      "image/*",
    );

    expect(getFile).not.toHaveBeenCalled();
  });
});
