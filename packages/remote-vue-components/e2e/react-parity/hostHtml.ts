/**
 * The host's output, reduced to what two frameworks must agree on.
 *
 * Only what differs between two renders of the _same_ tree is rewritten, and
 * each rule names where that difference comes from. Everything else — the
 * element tree, every attribute, every style declaration, the text — is
 * compared as the browser holds it. Modelled on the cross-version harness's
 * `normalizeHtml.ts` in `remote-react-components`.
 */

/**
 * Generated id fragments, wherever an attribute holds one: React's `useId`
 * (`_r_4ff_`, `:r4f:` before React 19.1), react-aria's description counter
 * (`react-aria-description-3`) and its collection-key counter
 * (`data-key="react-aria-18"`). They are counters, so a pass that skipped a
 * scenario numbers everything after it differently. Matched as fragments,
 * because they sit inside larger values — `react-aria-_r_2l1_-0`,
 * `url(#clipPath-recharts-bar-_r_1cv_)` — whose other parts stay compared.
 */
const generatedFragment =
  /_r_[0-9a-z]+_|:r[0-9a-z]+:|react-aria-description-\d+|react-aria-\d+(?![\w-])/g;

/**
 * Vue's `useId()` (`v-0`, `v-1-2`), which the Vue rebuilds use where React's
 * compositions call React's. Matched as a whole token and only in attributes
 * that reference ids, because a short value like that could be anything
 * elsewhere.
 */
const vueGeneratedId = /^v-\d+(?:-\d+)*$/;

const idReferenceAttributes = new Set([
  "id",
  "for",
  "aria-activedescendant",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-errormessage",
  "aria-flowto",
  "aria-labelledby",
  "aria-owns",
  "headers",
]);

/**
 * Rewrites generated ids to placeholders numbered by first appearance.
 *
 * The same id gets the same placeholder everywhere, so the wiring stays
 * compared: a label that points at the wrong control, or at nothing, still
 * differs. An id someone wrote stays as written.
 */
const createIdRewriter = () => {
  const placeholders = new Map<string, string>();
  const placeholderFor = (generated: string): string => {
    let placeholder = placeholders.get(generated);
    if (placeholder === undefined) {
      placeholder = `‹id-${placeholders.size + 1}›`;
      placeholders.set(generated, placeholder);
    }
    return placeholder;
  };

  return (name: string, value: string): string => {
    const tokens = idReferenceAttributes.has(name)
      ? value
          .split(" ")
          .map((token) =>
            vueGeneratedId.test(token) ? placeholderFor(token) : token,
          )
          .join(" ")
      : value;
    return tokens.replace(generatedFragment, placeholderFor);
  };
};

/**
 * Style declarations whose value is not the binding's to decide, rewritten per
 * declaration: the property stays, so its presence is still compared.
 *
 * - `--animation-delay` on a loading spinner is taken from the clock, so that
 *   every spinner on a page turns in step.
 * - CodeMirror draws its caret from a measurement it takes in a frame of its own,
 *   before or after the editor font has loaded. The same corpus gave the caret
 *   17.23px in a full React pass and 16px in a React pass of only the code
 *   scenarios — history, not binding.
 *
 * Measured positions elsewhere stay compared on evidence: react-aria's overlay
 * placement, the modal's viewport variables, the tab indicator and recharts'
 * geometry came out identical to the sub-pixel in two React passes and the Vue
 * one. They are also where a dropped `offset` or `placement` shows up, and
 * nowhere else.
 */
const normalizedDeclarations = (element: Element, style: string): string => {
  const isCodeMirrorCaret =
    element.classList.contains("cm-cursor") ||
    element.classList.contains("cm-selectionBackground");

  return style
    .split(";")
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      if (separator === -1) {
        return declaration;
      }
      const property = declaration.slice(0, separator).trim();
      if (property === "--animation-delay") {
        return ` ${property}: ‹clock›`;
      }
      if (
        isCodeMirrorCaret &&
        ["left", "top", "width", "height"].includes(property)
      ) {
        return ` ${property}: ‹measured›`;
      }
      return declaration;
    })
    .join(";")
    .trim();
};

export interface HostHtmlOptions {
  /**
   * Whether the scenario generated a password. Only then is a password value
   * masked — one the scenario typed is content like any other.
   */
  hasGeneratedPassword?: boolean;
}

export const hostHtml = (
  root: Element,
  { hasGeneratedPassword = false }: HostHtmlOptions = {},
): string => {
  const clone = root.cloneNode(true) as Element;
  const rewriteIds = createIdRewriter();

  for (const element of Array.from(clone.querySelectorAll("*"))) {
    /*
     * A generated password is different every time by design — the field's
     * whole point. The React package's cross-version harness retries around the
     * same non-determinism.
     */
    if (
      hasGeneratedPassword &&
      element.getAttribute("type") === "password" &&
      element.hasAttribute("value")
    ) {
      element.setAttribute("value", "‹generated›");
    }

    const style = element.getAttribute("style");
    if (style !== null) {
      element.setAttribute("style", normalizedDeclarations(element, style));
    }

    /*
     * `class` as a token set: React and Vue build the list in their own order
     * and spacing, which is notation rather than content. A class present on
     * one side and absent on the other still differs.
     */
    const classes = element.getAttribute("class");
    if (classes !== null) {
      element.setAttribute(
        "class",
        [...new Set(classes.split(/\s+/).filter(Boolean))].sort().join(" "),
      );
    }

    /*
     * Attributes in name order, for the same reason — and before the ids are
     * rewritten, so the placeholders are numbered in an order both passes
     * share.
     */
    const attributes = Array.from(element.attributes).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
    for (const attribute of attributes) {
      element.removeAttribute(attribute.name);
    }
    for (const attribute of attributes) {
      element.setAttribute(
        attribute.name,
        rewriteIds(attribute.name, attribute.value),
      );
    }
  }

  // One tag per line, so a mismatch diffs readably instead of as one string.
  return clone.innerHTML.replace(/></g, ">\n<");
};

/**
 * Elements kept once per document, not per render — so whether one exists, or
 * what it holds, depends on which scenarios ran before.
 *
 * - React-aria's live announcer, filled when something is announced and emptied
 *   on a timer of its own — a search in one scenario was still announcing "0
 *   matches" while the next one was read.
 * - Recharts' text-measurement span, holding whatever it measured last.
 * - Flow's overlay container (`data-flow-overlays`, `OverlayContent`) while it is
 *   empty. It is created by the first modal in the document and never removed,
 *   so an empty one only says that some earlier scenario opened a modal — and
 *   vitest orders the files of the two passes differently. Once it holds a
 *   modal it is compared like any other overlay.
 */
const isDocumentSingleton = (element: Element): boolean =>
  element.hasAttribute("data-live-announcer") ||
  element.id === "recharts_measurement_span" ||
  (element.hasAttribute("data-flow-overlays") &&
    element.childElementCount === 0);

/**
 * React-aria's description nodes (`useDescription`): one per description text
 * for the whole document, shared by every element that uses it and removed only
 * when the last one unmounts. So a node can outlive the scenario that created
 * it, and only the ones this output points at belong to it.
 */
const isDescriptionNode = (element: Element): boolean =>
  /^react-aria-description-\d+$/.test(element.id);

/**
 * What the host rendered: its container's children, plus what it portalled to
 * `document.body`.
 *
 * An overlay — a popover, a modal, the notification container — is rendered
 * into the body rather than into the tree that opened it, so reading only the
 * container compares everything about a menu except the menu. `harnessRoots`
 * are the harness's own elements in the body: the host's root, which holds the
 * container, and the remote app's, whose `flr-*` tree differs by construction.
 *
 * Returned as a detached element in document order, for `hostHtml`.
 */
export const hostOutput = (
  container: Element,
  harnessRoots: readonly Element[],
): Element => {
  const portalled = Array.from(document.body.children).filter(
    (child) => !harnessRoots.includes(child) && !isDocumentSingleton(child),
  );
  const rendered = [
    ...Array.from(container.children),
    ...portalled.filter((child) => !isDescriptionNode(child)),
  ];

  const describedBy = new Set(
    rendered.flatMap((element) =>
      [element, ...Array.from(element.querySelectorAll("[aria-describedby]"))]
        .flatMap(
          (described) =>
            described.getAttribute("aria-describedby")?.split(/\s+/) ?? [],
        )
        .filter(Boolean),
    ),
  );

  const output = document.createElement("div");
  output.append(
    ...[...Array.from(container.children), ...portalled]
      .filter(
        (element) => !isDescriptionNode(element) || describedBy.has(element.id),
      )
      .map((element) => element.cloneNode(true)),
  );
  return output;
};
