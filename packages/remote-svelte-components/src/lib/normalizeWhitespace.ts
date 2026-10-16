/**
 * Keeps the whitespace a Svelte template carries out of the remote tree.
 *
 * Svelte keeps a text node wherever the source has whitespace between two
 * nodes: it removes whitespace between two block-level HTML elements, but a
 * `flr-*` element is a custom element, so it is treated as inline and the
 * whitespace stays. That text node is mirrored to the host and rendered as a
 * child of the Flow component — inside a `Section`, which lays its children out
 * with `flex`, every one of them becomes an anonymous flex item and a second
 * gap.
 *
 * Nothing about it is visible in the source: the template reads the way every
 * other Svelte template does, and the layout is subtly wrong.
 *
 * So it is normalized here rather than being a rule every extension developer
 * has to know. Three conditions, and all three are needed:
 *
 * - **The parent is a `flr-*` element.** Plain DOM the app renders — an `<svg>`,
 *   a paragraph with an `<em>` in it — travels through the remote tree too, and
 *   there whitespace between elements is content.
 * - **The text is whitespace and not empty.** Svelte's block anchors are empty
 *   text nodes; moving them would break the blocks that are delimited by them.
 * - **Both neighbours are elements or absent.** `<Text>{a} {b}</Text>` puts a
 *   space between two expressions, and that space is the author's.
 *
 * The node is removed, not blanked. An empty text node still _is_ a child on
 * the host, and a Flow component that requires exactly one text child —
 * `Initials`, `Markdown`, `Truncate`, through `extractTextFromFirstChild` —
 * counts it and gives up. Removing is safe here precisely because of the
 * conditions above: what they select is static template whitespace, never one
 * of Svelte's own anchors, which are empty or comments.
 */
const isBlankText = (node: Node): node is Text =>
  node.nodeType === Node.TEXT_NODE && /^\s+$/.test(node.nodeValue ?? "");

/**
 * Svelte's own anchors — an empty text node or a comment, depending on what it
 * is marking the position of. Neither separates anything, and neither reaches
 * the host.
 */
const isAnchor = (node: Node | null): boolean =>
  !!node &&
  (node.nodeType === Node.COMMENT_NODE ||
    (node.nodeType === Node.TEXT_NODE && node.nodeValue === ""));

const siblingBefore = (node: Node): Node | null => {
  let sibling = node.previousSibling;
  while (isAnchor(sibling)) {
    sibling = sibling?.previousSibling ?? null;
  }
  return sibling;
};

const siblingAfter = (node: Node): Node | null => {
  let sibling = node.nextSibling;
  while (isAnchor(sibling)) {
    sibling = sibling?.nextSibling ?? null;
  }
  return sibling;
};

const isElementOrAbsent = (node: Node | null): boolean =>
  node === null || node.nodeType === Node.ELEMENT_NODE;

const isRemoteElement = (node: Node | null): boolean =>
  !!node &&
  node.nodeType === Node.ELEMENT_NODE &&
  (node as Element).tagName.startsWith("FLR-");

const normalizeNode = (node: Node): void => {
  if (
    isBlankText(node) &&
    isRemoteElement(node.parentNode) &&
    isElementOrAbsent(siblingBefore(node)) &&
    isElementOrAbsent(siblingAfter(node))
  ) {
    node.remove();
  }
};

const normalizeTree = (root: Node): void => {
  normalizeNode(root);

  if (root.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let text = walker.nextNode();
  while (text) {
    normalizeNode(text);
    text = walker.nextNode();
  }
};

/**
 * Watches the remote tree and blanks the template whitespace in it. Returns the
 * function that stops watching.
 */
export const normalizeRemoteWhitespace = (root: Element): (() => void) => {
  normalizeTree(root);

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const added of record.addedNodes) {
        normalizeTree(added);
      }
    }
  });

  observer.observe(root, { childList: true, subtree: true });

  return () => observer.disconnect();
};
