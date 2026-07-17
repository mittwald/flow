import { describe, expect, it } from "vitest";
import { structuralHtml } from "./structuralHtml";

describe("structuralHtml", () => {
  it("strips all attributes but keeps tag structure and text", () => {
    const input =
      '<div class="a" data-x="1"><span style="color:red">hi</span></div>';
    expect(structuralHtml(input)).toBe("<div><span>hi</span></div>");
  });

  it("masks attribute-level drift so differing attributes compare equal", () => {
    const current = '<hr class="flow--separator flow--separator--vertical">';
    const old = '<hr class="flow--separator">';
    expect(structuralHtml(current)).toBe(structuralHtml(old));
  });

  it("masks icon geometry drift (differing svg/path attributes)", () => {
    const current = '<svg viewBox="0 0 21 20"><path d="M12 7"></path></svg>';
    const old = '<svg viewBox="0 0 24 24"><path d="M9 3"></path></svg>';
    expect(structuralHtml(current)).toBe(structuralHtml(old));
  });

  it("keeps a real structural difference (added/removed element)", () => {
    const withIcon = "<span><svg><path></path></svg>text</span>";
    const withoutIcon = "<span>text</span>";
    expect(structuralHtml(withIcon)).not.toBe(structuralHtml(withoutIcon));
  });

  it("keeps a real text difference", () => {
    expect(structuralHtml("<span>a</span>")).not.toBe(
      structuralHtml("<span>b</span>"),
    );
  });

  it("removes the hidden connection iframe", () => {
    const input =
      "<button>ok</button>" +
      '<iframe src="http://localhost:4321/" ' +
      'style="visibility: hidden; height: 0px;"></iframe>';
    expect(structuralHtml(input)).toBe("<button>ok</button>");
  });

  it("normalizes self-closing tags and preserves closing tags", () => {
    const input = '<ul><li a="1"/><li>x</li></ul>';
    expect(structuralHtml(input)).toBe("<ul><li/><li>x</li></ul>");
  });

  it("collapses insignificant whitespace between tags", () => {
    const input = "<div>\n  <span>x</span>\n</div>";
    expect(structuralHtml(input)).toBe("<div><span>x</span></div>");
  });
});
