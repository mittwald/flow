/**
 * The host's output, reduced to what two frameworks must agree on.
 *
 * Everything removed here differs between two renders of the _same_ tree, so
 * comparing it would report noise as a divergence:
 *
 * - **react-aria's generated ids**, and every attribute that points at one. They
 *   are counters, so the second render in a file never repeats the first.
 * - **`style` on the element react-aria measures** — overlay positions land on
 *   sub-pixel differences.
 * - **the order of attributes and of class tokens** — React sets them in the
 *   order it built them, Vue in its own. The resulting DOM is the same element;
 *   only the serialization differs, so both are sorted rather than compared.
 *
 * What stays is the element tree, the classes, the ARIA state and the text —
 * which is where a binding that drops a prop or mis-names an event shows up.
 */
const generatedIdPattern = /react-aria[\w:-]*/g;

/*
 * react-aria's collection keys (`data-key="_r_4ff_"`), which also end up inside
 * the `clip-path` urls recharts builds. Counters, like the ids — the second
 * render in a page never repeats the first.
 */
const generatedKeyPattern = /_r_[a-z0-9]+_/g;

const idAttributes = [
  "id",
  "for",
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-activedescendant",
  "aria-details",
];

export const hostHtml = (container: Element): string => {
  const clone = container.cloneNode(true) as Element;

  for (const element of [clone, ...Array.from(clone.querySelectorAll("*"))]) {
    for (const attribute of idAttributes) {
      if (element.hasAttribute(attribute)) {
        element.setAttribute(attribute, "‹id›");
      }
    }
    const style = element.getAttribute("style");
    if (style !== null && /\d/.test(style)) {
      element.setAttribute("style", "‹measured›");
    }

    /*
     * A generated password is different every time by design — the field's
     * whole point. The React package's cross-version harness retries around the
     * same non-determinism.
     */
    if (
      element.getAttribute("type") === "password" &&
      element.hasAttribute("value")
    ) {
      element.setAttribute("value", "‹generated›");
    }

    const classes = element.getAttribute("class");
    if (classes !== null) {
      element.setAttribute(
        "class",
        classes.split(/\s+/).filter(Boolean).sort().join(" "),
      );
    }

    const attributes = Array.from(element.attributes).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
    for (const attribute of attributes) {
      element.removeAttribute(attribute.name);
    }
    for (const attribute of attributes) {
      element.setAttribute(attribute.name, attribute.value);
    }
  }

  return (
    clone.innerHTML
      .replace(generatedIdPattern, "‹id›")
      .replace(generatedKeyPattern, "‹key›")
      // One tag per line, so a mismatch diffs readably instead of as one string.
      .replace(/></g, ">\n<")
  );
};
