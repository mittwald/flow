/**
 * What the host rendered, as text — the reference the two runs compare.
 *
 * Not a screenshot: a screenshot answers "does it look the same", which needs a
 * committed baseline per platform and reports a missing prop as a few pixels.
 * The DOM answers "did the host receive the same thing", which is the actual
 * question about a binding, and reports a missing prop as a missing attribute.
 */
const generatedIdAttributes = new Set([
  "id",
  "for",
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-activedescendant",
  "aria-details",
  "aria-owns",
  "list",
]);

/*
 * The package version each binding announces — the one attribute that is
 * *supposed* to differ.
 */
const versionAttributes = new Set(["data-flr-version"]);

const measuredValue = /-?\d+(\.\d+)?(px|em|rem|ms|s|%)/g;

/*
 * React's `useId` mints `_r_<counter>_`, and react-aria prefixes it with its own
 * instance (`react-aria<n>-_r_<counter>_`). Both turn up in more than the
 * attributes above — a `RadioGroup` takes one as its `name`, recharts builds
 * `clipPath-recharts-bar-_r_5d_` out of one — and the counter depends on how
 * many components rendered before, which two independent mounts never agree on.
 * The shape is distinctive enough to normalize by value wherever it appears.
 */
const generatedId = /(react-aria\d*-)?_r_[a-z\d]+_/g;

const normalizeAttributeValue = (name: string, value: string): string => {
  if (generatedIdAttributes.has(name) || versionAttributes.has(name)) {
    return "…";
  }

  if (generatedId.test(value)) {
    generatedId.lastIndex = 0;
    return value.replaceAll(generatedId, "…");
  }

  /*
   * A measured value is the host's own arithmetic — react-aria writes popover
   * offsets and virtualizer heights as inline pixels, and the loading spinner
   * writes an animation delay derived from the clock. All of them move between
   * two runs for reasons that have nothing to do with the binding.
   */
  if (name === "style") {
    return value.replaceAll(measuredValue, "…$2");
  }

  /*
   * `clsx` leaves a trailing space wherever a conditional class was false, and
   * where the separator lands is not something either binding decided. The
   * *order* is left alone: that is how the classes were assembled, and a
   * difference in it is a real one.
   */
  if (name === "class") {
    return value.trim().replaceAll(/\s+/g, " ");
  }

  return value;
};

/*
 * `PasswordCreationField` generates a password. It is different on every render
 * by design, so no two runs can agree on it — including two React ones.
 */
const isGeneratedPassword = (element: Element, name: string): boolean =>
  name === "value" &&
  element.tagName === "INPUT" &&
  element.getAttribute("type") === "password";

const serializeElement = (element: Element, depth: number): string[] => {
  const indent = "  ".repeat(depth);
  const tag = element.tagName.toLowerCase();

  const attributes = [...element.attributes]
    .map((attribute) => ({
      name: attribute.name,
      value: isGeneratedPassword(element, attribute.name)
        ? "…"
        : normalizeAttributeValue(attribute.name, attribute.value),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((attribute) => ` ${attribute.name}="${attribute.value}"`)
    .join("");

  const children = serializeChildren(element, depth + 1);

  if (children.length === 0) {
    return [`${indent}<${tag}${attributes} />`];
  }

  return [`${indent}<${tag}${attributes}>`, ...children, `${indent}</${tag}>`];
};

/*
 * Adjacent text nodes are merged before they are written out.
 *
 * How text is split into nodes is the framework's business, not the host's:
 * `<Button>{label} Pending</Button>` is two text children in React and one in
 * Svelte, and the reader — and `textContent` — cannot tell. What the host
 * received is the same string either way, so that is what gets compared.
 */
const serializeChildren = (parent: Node, depth: number): string[] => {
  const lines: string[] = [];
  let pendingText = "";

  const flushText = () => {
    const text = pendingText.trim();
    if (text) {
      lines.push(`${"  ".repeat(depth)}${text}`);
    }
    pendingText = "";
  };

  for (const child of parent.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      pendingText += child.nodeValue ?? "";
      continue;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      flushText();
      lines.push(...serializeElement(child as Element, depth));
    }
  }

  flushText();

  return lines;
};

export const hostSnapshot = (host: Element): string =>
  `${serializeChildren(host, 0).join("\n")}\n`;
