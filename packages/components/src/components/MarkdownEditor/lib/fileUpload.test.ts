import { describe, expect, test } from "vitest";
import {
  insertAtCaret,
  removePlaceholder,
  replacePlaceholder,
  uploadedFileMarkdown,
  uploadPlaceholder,
} from "@/components/MarkdownEditor/lib/fileUpload";

const file = (name: string, type = "image/png") => ({ name, type });

describe("uploadPlaceholder", () => {
  test("is the comment GitHub leaves behind", () => {
    expect(uploadPlaceholder("screenshot.png")).toBe(
      '<!-- Uploading "screenshot.png"... -->',
    );
  });

  test("keeps a file name from ending the comment early", () => {
    expect(uploadPlaceholder("we-->done.png")).toBe(
      '<!-- Uploading "we--done.png"... -->',
    );
  });
});

describe("uploadedFileMarkdown", () => {
  test("embeds an image", () => {
    expect(
      uploadedFileMarkdown(file("cat.png"), { url: "https://cdn/cat.png" }),
    ).toBe("![cat.png](https://cdn/cat.png)");
  });

  test("links anything else", () => {
    expect(
      uploadedFileMarkdown(file("report.pdf", "application/pdf"), {
        url: "https://cdn/report.pdf",
      }),
    ).toBe("[report.pdf](https://cdn/report.pdf)");
  });

  test("takes the label from the upload result", () => {
    expect(
      uploadedFileMarkdown(file("dsc00042.png"), {
        url: "https://cdn/a.png",
        name: "The roof",
      }),
    ).toBe("![The roof](https://cdn/a.png)");
  });

  test("escapes brackets and line breaks in the label", () => {
    expect(
      uploadedFileMarkdown(file("[draft]\nv2.png"), { url: "https://cdn/a" }),
    ).toBe("![\\[draft\\] v2.png](https://cdn/a)");
  });

  test("wraps a target that would end at a space or parenthesis", () => {
    expect(
      uploadedFileMarkdown(file("a.png"), { url: "https://cdn/a b" }),
    ).toBe("![a.png](<https://cdn/a b>)");
    expect(
      uploadedFileMarkdown(file("a.png"), { url: "https://cdn/a(1)" }),
    ).toBe("![a.png](<https://cdn/a(1)>)");
  });
});

describe("insertAtCaret", () => {
  test("inserts into an empty editor without a leading break", () => {
    expect(insertAtCaret("", "X", 0)).toEqual({
      value: "X\n",
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  test("breaks the line the caret sits in", () => {
    expect(insertAtCaret("hello", "X", 5)).toEqual({
      value: "hello\nX\n",
      selectionStart: 8,
      selectionEnd: 8,
    });
  });

  test("adds no break when the caret already starts a line", () => {
    expect(insertAtCaret("hello\n", "X", 6)).toEqual({
      value: "hello\nX\n",
      selectionStart: 8,
      selectionEnd: 8,
    });
  });

  test("keeps the text after the caret on its own line", () => {
    expect(insertAtCaret("ab", "X", 1)).toEqual({
      value: "a\nX\nb",
      selectionStart: 4,
      selectionEnd: 4,
    });
  });
});

describe("replacePlaceholder", () => {
  const value = 'a <!-- Uploading "x.png"... --> b';
  const placeholder = uploadPlaceholder("x.png");

  test("replaces the first occurrence", () => {
    expect(replacePlaceholder(value, placeholder, "![x](u)", 0, 0)?.value).toBe(
      "a ![x](u) b",
    );
  });

  test("reports nothing when the placeholder is gone", () => {
    expect(replacePlaceholder("a b", placeholder, "![x](u)", 0, 0)).toBeNull();
  });

  test("leaves a cursor in front of it alone", () => {
    const edit = replacePlaceholder(value, placeholder, "![x](u)", 1, 1);
    expect(edit).toMatchObject({ selectionStart: 1, selectionEnd: 1 });
  });

  test("carries a cursor behind it by the length difference", () => {
    const behind = value.length;
    const edit = replacePlaceholder(
      value,
      placeholder,
      "![x](u)",
      behind,
      behind,
    );

    expect(edit?.selectionStart).toBe(behind + (7 - placeholder.length));
    expect(edit?.value.slice(edit.selectionStart)).toBe("");
  });

  test("puts a cursor inside it behind the replacement", () => {
    const edit = replacePlaceholder(value, placeholder, "![x](u)", 5, 5);
    expect(edit).toMatchObject({ selectionStart: 9, selectionEnd: 9 });
  });
});

describe("removePlaceholder", () => {
  test("takes the line break it was inserted with along", () => {
    const placeholder = uploadPlaceholder("x.png");
    expect(
      removePlaceholder(`a\n${placeholder}\nb`, placeholder, 0, 0),
    ).toEqual({
      value: "a\nb",
      selectionStart: 0,
      selectionEnd: 0,
    });
  });

  test("removes a placeholder that has no break behind it", () => {
    const placeholder = uploadPlaceholder("x.png");
    expect(
      removePlaceholder(`a\n${placeholder}`, placeholder, 0, 0)?.value,
    ).toBe("a\n");
  });
});
