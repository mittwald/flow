import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/Text";
import { sleep } from "@/lib/promises/sleep";
import { render } from "vitest-browser-react";

/**
 * The node list React Aria's `FocusScope` contains focus in: the siblings
 * between its two sentinel `<span>`s.
 */
const focusScopeNodeLists = () =>
  [...document.querySelectorAll("[data-focus-scope-start]")].map((start) => {
    const nodes: Element[] = [];
    let node = start.nextSibling;

    while (
      node &&
      !(
        node.nodeType === Node.ELEMENT_NODE &&
        (node as Element).hasAttribute("data-focus-scope-end")
      )
    ) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        nodes.push(node as Element);
      }
      node = node.nextSibling;
    }

    return nodes;
  });

/**
 * Reverses the order of `document.body`'s children — the kind of reshuffling
 * browser extensions do to keep their own injected UI the last child. An
 * overlay portalled into the body directly gets separated from its sentinels
 * this way, which leaves its focus scope with an empty node list.
 */
const reorderBodyChildren = () => {
  for (const child of [...document.body.children]) {
    document.body.insertBefore(child, document.body.firstElementChild);
  }
};

test("an open Overlay keeps its focus scope when the body's children are reordered", async () => {
  await render(
    <Modal isDefaultOpen>
      <Heading>Install</Heading>
      <Content>
        <Text>Hello World</Text>
      </Content>
    </Modal>,
  );

  const overlay = document.querySelector(".flow--overlay");
  if (!overlay) {
    throw new Error("no overlay rendered");
  }

  reorderBodyChildren();
  await sleep(50);

  const nodeLists = focusScopeNodeLists();
  expect(nodeLists.length).toBeGreaterThan(0);

  // An empty node list makes a containing scope treat the whole document as
  // foreign, so it restores focus from its own `focusin` listener — and that
  // `focus()` call re-enters the listener until the call stack overflows.
  for (const nodes of nodeLists) {
    expect(nodes.length).toBeGreaterThan(0);
  }
  expect(
    nodeLists.some((nodes) =>
      nodes.some((node) => node === overlay || node.contains(overlay)),
    ),
  ).toBe(true);
});

test("the overlay container stays the last child of body", async () => {
  const dom = await render(
    <Modal isDefaultOpen>
      <Heading>Install</Heading>
      <Content>
        <Text>Hello World</Text>
      </Content>
    </Modal>,
  );

  const container = document.querySelector("body > [data-flow-overlays]");
  expect(container).toBe(document.body.lastElementChild);

  // Anything can append to body later — a toast root, a third-party widget, the
  // next test's render container.
  const foreign = document.createElement("div");
  document.body.append(foreign);

  try {
    // The overlay is `position: fixed` with `z-index: auto`, so being last is
    // what paints it above the page. Losing that puts page content over open
    // overlays and takes the page out of the backdrop the overlay blurs.
    await dom.rerender(
      <Modal isDefaultOpen>
        <Heading>Install</Heading>
        <Content>
          <Text>Changed</Text>
        </Content>
      </Modal>,
    );
    await sleep(50);
    expect(container).toBe(document.body.lastElementChild);
  } finally {
    foreign.remove();
  }
});
