import {
  IconClose,
  IconDelete,
  IconSetProvider,
  IconStar,
  Text,
  type IconSet,
} from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

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

/*
 * The one component here with no counterpart in
 * `@mittwald/flow-remote-react-components`: React's `IconSetProvider` is
 * exported from `@mittwald/flow-react-components`, not from the remote surface.
 * It earns its place because there is no Vue build of the pro set.
 */
describe("IconSetProvider", () => {
  const squareCheck = defineComponent({
    name: "SquareCheck",
    setup: () => () =>
      h("svg", { "^viewBox": "0 0 448 512", "^class": "replacement" }, [
        h("path", { "^d": "M64 80l320 0z" }),
      ]),
  });

  /*
   * The host's copy of the replacement, not the remote tree's.
   *
   * Both halves are in this document and both carry the author's `.replacement`
   * class, so a bare `svg.replacement` finds whichever comes first — and before
   * the host has materialised it, that is the remote one, which never gets
   * Flow's classes. `flow--icon` is the part only the host adds.
   */
  const hostReplacement = () =>
    document.querySelector("svg.flow--icon.replacement");

  const withSet = (set: IconSet) =>
    renderRemote(
      defineComponent(
        () => () =>
          h(IconSetProvider, { set }, () => [h(IconClose), h(IconDelete)]),
      ),
    );

  test("replaces the icons its set names", async () => {
    withSet({ Close: squareCheck });

    await vi.waitFor(() => expect(hostReplacement()).not.toBeNull());

    /* Unscoped on purpose: the icon it replaced is in neither half. */
    expect(document.querySelector("svg.tabler-icon-x")).toBeNull();
  });

  /*
   * Partial on purpose — React's `IconSet` is `typeof defaultIconSet` and
   * demands all 132, which works there because the pro set is a complete second
   * one to hand it. There is none for Vue, so what is left out keeps Flow's.
   */
  test("keeps Flow's icon where the set has none", async () => {
    withSet({ Close: squareCheck });

    await vi.waitFor(() =>
      expect(document.querySelector("svg.tabler-icon-trash")).not.toBeNull(),
    );
  });

  /* The swap is on the `<svg>`: a replacement is an icon, not a new wrapper. */
  test("gives the replacement Flow's own icon treatment", async () => {
    withSet({ Close: squareCheck });

    await vi.waitFor(() => expect(hostReplacement()).not.toBeNull());

    expect(hostReplacement()?.getAttribute("class")).toContain("flow--icon");
    expect(hostReplacement()?.getAttribute("role")).toBe("img");
  });

  test("takes a set that is swapped later", async () => {
    const set = ref<IconSet>({});
    renderRemote(
      defineComponent(
        () => () => h(IconSetProvider, { set: set.value }, () => h(IconClose)),
      ),
    );

    await vi.waitFor(() =>
      expect(document.querySelector("svg.tabler-icon-x")).not.toBeNull(),
    );

    set.value = { Close: squareCheck };

    await vi.waitFor(() => expect(hostReplacement()).not.toBeNull());
  });
});
