import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Label from "@/components/Label";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
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

test("the backdrop covers the viewport, not the whole document", async () => {
  // react-aria reads the page's scroll height during render, so the page has to
  // be long before the overlay mounts.
  const filler = document.createElement("div");
  filler.style.height = "5000px";
  document.body.append(filler);

  try {
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

    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const { height } = overlay.getBoundingClientRect();

    expect(document.documentElement.scrollHeight).toBeGreaterThan(
      viewportHeight * 2,
    );

    // It must cover everything on screen …
    expect(height).toBeGreaterThanOrEqual(viewportHeight - 1);

    // … and nothing beyond it. The element is `position: fixed`, so extra
    // height is never visible — but `backdrop-filter` blurs the whole layer
    // every frame, and Chromium drops an oversized one for single frames while
    // scrolling. Sizing this to the document height flickers backdrop and modal
    // on any page longer than the viewport.
    expect(height).toBeLessThanOrEqual(viewportHeight + 1);
  } finally {
    filler.remove();
  }
});

const LoginModal = ({ label }: { label: string }) => (
  <Modal isDefaultOpen>
    <Heading>Login</Heading>
    <Content>
      <TextField autoFocus>
        <Label>{label}</Label>
      </TextField>
    </Content>
  </Modal>
);

test.each([
  // 1Password appends its inline menu to body when a field gets focus.
  ["a browser extension", "com-1password-button"],
  ["the page", "div"],
])(
  "a focused field in an Overlay keeps focus when %s appends to body",
  async (_, tagName) => {
    const dom = await render(<LoginModal label="Email" />);
    const input = document.querySelector("input");
    await expect.poll(() => document.activeElement).toBe(input);

    const foreign = document.createElement(tagName);
    document.body.append(foreign);

    try {
      await dom.rerender(<LoginModal label="E-Mail" />);
      await sleep(50);
      expect(document.activeElement).toBe(input);
    } finally {
      foreign.remove();
    }
  },
);

test("a scrolled Overlay keeps its scroll position when the page appends to body", async () => {
  const TallModal = ({ label }: { label: string }) => (
    <Modal isDefaultOpen>
      <Heading>{label}</Heading>
      <Content>
        <div style={{ height: "3000px" }} />
      </Content>
    </Modal>
  );

  const dom = await render(<TallModal label="Install" />);
  const content = document.querySelector<HTMLElement>(".flow--modal--content");
  if (!content) {
    throw new Error("no modal content rendered");
  }
  content.scrollTop = 200;
  expect(content.scrollTop).toBe(200);

  // react-aria mounts hidden description nodes on body while a popover inside
  // the modal opens — a plain `div`, appended after the overlay container.
  const foreign = document.createElement("div");
  document.body.append(foreign);

  try {
    await dom.rerender(<TallModal label="Changed" />);
    await sleep(50);
    expect(content.scrollTop).toBe(200);
  } finally {
    foreign.remove();
  }
});

test("an extension node appended after the overlay container leaves it in place", async () => {
  const dom = await render(<LoginModal label="Email" />);
  const container = document.querySelector("body > [data-flow-overlays]");

  const extension = document.createElement("com-1password-button");
  document.body.append(extension);

  try {
    await dom.rerender(<LoginModal label="E-Mail" />);
    await sleep(50);
    expect(container?.nextElementSibling).toBe(extension);
  } finally {
    extension.remove();
  }
});

test("nodes appended after the overlay container are not moved", async () => {
  const dom = await render(<LoginModal label="Email" />);

  // Moving an iframe reloads it. The remote renderer's iframe lives in page
  // content, so pushing page content around costs extension state.
  const iframe = document.createElement("iframe");
  iframe.srcdoc = "<p>remote</p>";
  let loads = 0;
  iframe.addEventListener("load", () => loads++);
  document.body.append(iframe);
  await expect.poll(() => loads).toBe(1);

  try {
    await dom.rerender(<LoginModal label="E-Mail" />);
    await sleep(100);
    expect(loads).toBe(1);
    expect(document.body.lastElementChild).toBe(
      document.querySelector("body > [data-flow-overlays]"),
    );
  } finally {
    iframe.remove();
  }
});
