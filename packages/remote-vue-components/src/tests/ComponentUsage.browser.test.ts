import {
  Content,
  Heading,
  List,
  ListItem,
  ListItemView,
  ListStaticData,
  Modal,
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

test("a composition reports itself and what it was given, not its own elements", async () => {
  const reported = collectUsage(() =>
    h(Modal, { isDefaultOpen: true }, () => [
      h(Heading, null, () => "Crew"),
      h(Content, null, () => h(Text, null, () => "Three on board")),
    ]),
  );

  await vi.waitFor(() => expect(reported).toContain("Text"));

  expect(reported).toContain("Modal");
  expect(reported).toContain("Heading");
  expect(reported).toContain("Content");
  expect(reported).not.toContain("OverlayContent");
  expect(reported).not.toContain("ClearPropsContext");
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
