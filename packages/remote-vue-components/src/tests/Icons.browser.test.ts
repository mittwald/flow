import { IconClose, IconStar, Text } from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

afterEach(() => cleanupRemote());

/*
 * A Flow icon is not a remote element: it is `Icon` with an `<svg>` inside, and
 * the host merges its own classes and ARIA onto that very element. So what the
 * generated Vue icons have to get right is the `<svg>` — Tabler's attribute
 * set, the path data, the `tabler-icon` classes — and hand everything else to
 * the host.
 *
 * That the host builds the *same* tree React's icons produce is asserted by the
 * parity harness, over every icon the visual corpus uses. What is here is the
 * shape, so a failure says what broke rather than which snapshot moved.
 */
/*
 * The host's icon, not the remote tree's. Both live in this document — the
 * remote half is a hidden DOM of `flr-*` elements with the same `<svg>` inside
 * it — and `flow--icon` is the class only the host puts on.
 */
const hostSvg = () => document.querySelector("svg.flow--icon");

const renderIcon = async (icon: unknown, props?: Record<string, unknown>) => {
  renderRemote(defineComponent(() => () => h(icon as never, props ?? null)));
  await vi.waitFor(() => expect(hostSvg()).not.toBeNull());
  return hostSvg() as SVGElement;
};

describe("generated icons", () => {
  test("renders Tabler's svg with its path data", async () => {
    const svg = await renderIcon(IconClose);

    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("stroke")).toBe("currentColor");
    expect(svg.getAttribute("stroke-width")).toBe("2");
    expect(
      [...svg.querySelectorAll("path")].map((p) => p.getAttribute("d")),
    ).toEqual(["M18 6l-12 12", "M6 6l12 12"]);
  });

  /*
   * The class the host cannot derive: it identifies the icon, and Flow's own
   * `flow--icon*` classes are merged onto the same element by the host.
   */
  test("keeps Tabler's own classes and gets Flow's from the host", async () => {
    const svg = await renderIcon(IconClose);
    const classes = (svg.getAttribute("class") ?? "").split(/\s+/);

    expect(classes).toContain("tabler-icon");
    expect(classes).toContain("tabler-icon-x");
    expect(classes).toContain("flow--icon");
  });

  /*
   * `icons.yaml` writes its custom icons as JSX, so their attributes arrive in
   * React's spelling. An SVG element ignores `strokeWidth`, and the icon would
   * render without its stroke rather than fail.
   */
  test("gives a custom icon's attributes their SVG spelling", async () => {
    const svg = await renderIcon(IconStar);

    expect(svg.getAttribute("viewBox")).toBe("0 0 21 20");
    expect(svg.querySelector("path")?.getAttribute("stroke-width")).toBe("1.5");
  });

  test("forwards the Flow Icon props it was given", async () => {
    const svg = await renderIcon(IconClose, {
      size: "l",
      "aria-label": "Close it",
    });

    expect(svg.getAttribute("aria-label")).toBe("Close it");
    expect(svg.getAttribute("class")).toContain("flow--icon--size-l");
  });

  test("travels inside another component's slot", async () => {
    renderRemote(
      defineComponent(() => () => h(Text, null, () => [h(IconClose), "Close"])),
    );

    await vi.waitFor(() =>
      expect(document.querySelector("svg.tabler-icon-x")).not.toBeNull(),
    );
  });
});
