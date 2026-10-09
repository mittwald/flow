import {
  Action,
  ActionBatch,
  Button,
  Content,
  Heading,
  IconClose,
  LightBox,
  LightBoxTrigger,
  List,
  ListItem,
  ListItemView,
  ListStaticData,
  Modal,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  Text,
} from "@/index";
import { provideRemoteContext } from "@/composables/remoteContext";
import { afterEach, expect, test, vi } from "vitest";
import { createApp, defineComponent, h, ref, type App } from "vue";

/*
 * What the host is told an extension uses. Flow's React binding reports a
 * `flowComponent` under its name and nothing for the views a composition
 * renders for itself; the Vue binding has to draw the same line, or mStudio's
 * usage data counts `OverlayContent` for every `Modal` and never the `Modal`.
 */

let app: App | undefined;

afterEach(() => {
  app?.unmount();
  app = undefined;
  document.body.innerHTML = "";
});

const collectUsage = (render: () => unknown): Set<string> => {
  const reported = new Set<string>();
  const container = document.body.appendChild(document.createElement("div"));

  app = createApp(
    defineComponent({
      setup() {
        provideRemoteContext({
          connection: ref(),
          language: ref("en-US"),
          reportComponentUsage: (component) => reported.add(component),
        });
        return render;
      },
    }),
  );
  app.mount(container);

  return reported;
};

const sorted = (reported: Set<string>): string[] => [...reported].sort();

test("a composition reports itself and what it was given, not its own elements", async () => {
  const reported = collectUsage(() =>
    h(Modal, { isDefaultOpen: true }, () => [
      h(Heading, null, () => "Crew"),
      h(Content, null, () => h(Text, null, () => "Three on board")),
    ]),
  );

  await vi.waitFor(() => expect(reported).toContain("Text"));

  /*
   * Exactly these: not `OverlayContent` or `ClearPropsContext`, and not the
   * `Icon` or `Action` of the close button.
   */
  expect(sorted(reported)).toEqual(["Content", "Heading", "Modal", "Text"]);
});

test("a light box's own close button counts as nothing", async () => {
  const reported = collectUsage(() =>
    h(LightBox, { isOpen: true }, () => h(Text, null, () => "Plans")),
  );

  await vi.waitFor(() => expect(reported).toContain("Text"));

  expect(sorted(reported)).toEqual(["LightBox", "Text"]);
});

/* Flow's React icons render `IconView`: no icon is tracked (ADR 0003 §4). */
test("an icon the extension writes counts as nothing", async () => {
  const reported = collectUsage(() =>
    h(Button, null, () => [h(IconClose), h(Text, null, () => "Close")]),
  );

  await vi.waitFor(() => expect(reported).toContain("Text"));

  expect(sorted(reported)).toEqual(["Button", "Text"]);
});

/*
 * In React, `Action`, `ModalTrigger` and `PopoverTrigger` are
 * `flowComponent`s; `ActionBatch` renders an `Action` outside a view, and
 * `LightBoxTrigger` is a plain component.
 */
test.each([
  [
    "Action",
    () =>
      h(Action, { onAction: () => undefined }, () =>
        h(Button, null, () => "Fire"),
      ),
  ],
  [
    "ActionBatch",
    () => h(ActionBatch, null, () => h(Button, null, () => "Fire")),
  ],
])("%s reports what Flow's React one reports", async (_name, render) => {
  const reported = collectUsage(render);

  await vi.waitFor(() => expect(reported).toContain("Button"));

  expect(sorted(reported)).toEqual(["Action", "Button"]);
});

test("triggers report what Flow's React ones report", async () => {
  const reported = collectUsage(() => [
    h(ModalTrigger, null, () => [
      h(Button, null, () => "Open modal"),
      h(Modal, null, () => h(Heading, null, () => "Modal")),
    ]),
    h(PopoverTrigger, null, () => [
      h(Button, null, () => "Open popover"),
      h(Popover, null, () => h(Text, null, () => "Popover")),
    ]),
    h(LightBoxTrigger, null, () => [
      h(Button, null, () => "Open light box"),
      h(LightBox, null, () => h(Text, null, () => "Light box")),
    ]),
  ]);

  await vi.waitFor(() => expect(reported).toContain("PopoverTrigger"));

  /* No `LightBoxTrigger`, and not the `DialogTrigger` each one renders. */
  expect(sorted(reported)).toEqual([
    "Button",
    "Heading",
    "LightBox",
    "Modal",
    "ModalTrigger",
    "Popover",
    "PopoverTrigger",
    "Text",
  ]);
});

/*
 * The item's slot is a plain function the list calls from its own render. It
 * belongs to the extension all the same.
 */
test("a list's item content counts as the extension's", async () => {
  const reported = collectUsage(() =>
    h(
      List,
      { "aria-label": "Crew" },
      {
        default: () => [
          h(ListStaticData, { data: [{ name: "Ellen Ripley" }] }),
          h(ListItem, null, {
            default: ({ data }: { data: { name: string } }) =>
              h(ListItemView, null, () => h(Heading, null, () => data.name)),
          }),
        ],
      },
    ),
  );

  await vi.waitFor(() => expect(reported).toContain("Heading"));

  expect(reported).toContain("List");
  expect(reported).not.toContain("Div");
  expect(reported).not.toContain("ItemsGridList");
  expect(reported).not.toContain("ListItemViewContent");
});
