import { expect, test } from "vitest";
import type { ComponentDoc, PropItem } from "react-docgen-typescript";
import {
  buildComponentIndex,
  type ComponentIndex,
  type IndexedComponent,
  type StatusEntry,
} from "./buildComponentIndex";

const PACKAGE = "@mittwald/flow-react-components";

const prop = (overrides: Partial<PropItem> = {}): PropItem =>
  ({
    name: "x",
    description: "",
    required: false,
    defaultValue: null,
    type: { name: "string" },
    parent: {
      fileName: "components/src/components/Button/Button.tsx",
      name: "ButtonProps",
    },
    ...overrides,
  }) as PropItem;

const component = (
  displayName: string,
  filePath: string,
  props: Record<string, PropItem> = {},
  description = "",
): ComponentDoc =>
  ({
    displayName,
    filePath,
    description,
    props,
    methods: [],
    tags: {},
  }) as unknown as ComponentDoc;

const stable: StatusEntry = { level: "stable", isNew: false };

/** Reads an entry and fails the test if it is missing, so no `!` is needed. */
const entryOf = (index: ComponentIndex, key: string): IndexedComponent => {
  const entry = index[key];
  if (!entry) {
    throw new Error(`No index entry for "${key}".`);
  }
  return entry;
};

test("indexes a component with its props", () => {
  const index = buildComponentIndex(
    [
      component(
        "Button",
        "src/components/Button/Button.tsx",
        {
          variant: prop({
            name: "variant",
            type: { name: '"solid" | "soft" | undefined' },
            defaultValue: { value: "solid" },
            description: "The variant of the button.",
          }),
          children: prop({
            name: "children",
            required: true,
            type: { name: "ReactElement<unknown>" },
          }),
        },
        "A button.",
      ),
    ],
    { [`${PACKAGE}#Button`]: stable },
    PACKAGE,
  );

  expect(index).toStrictEqual({
    Button: {
      importFrom: [PACKAGE],
      level: "stable",
      description: "A button.",
      remote: { available: false },
      props: {
        children: { type: "ReactNode", required: true },
        variant: {
          type: '"solid" | "soft"',
          default: "solid",
          description: "The variant of the button.",
        },
      },
    },
  });
});

test("drops @internal props and inherited DOM attributes", () => {
  const index = buildComponentIndex(
    [
      component("Icon", "src/components/Icon/Icon.tsx", {
        size: prop({ name: "size" }),
        tunnel: prop({ name: "tunnel", description: "Plumbing. @internal" }),
        strokeDasharray: prop({
          name: "strokeDasharray",
          parent: {
            fileName:
              "flow/node_modules/.pnpm/@types+react@19.2.17/node_modules/@types/react/index.d.ts",
            name: "SVGAttributes",
          },
        }),
      }),
    ],
    { [`${PACKAGE}#Icon`]: stable },
    PACKAGE,
  );

  expect(Object.keys(entryOf(index, "Icon").props)).toStrictEqual(["size"]);
});

test("merges one component that is public on several surfaces", () => {
  const modal = component("Modal", "src/components/Modal/Modal.tsx");
  const index = buildComponentIndex(
    [modal],
    {
      [`${PACKAGE}#Modal`]: stable,
      [`${PACKAGE}/flr-universal#Modal`]: stable,
    },
    PACKAGE,
  );

  expect(Object.keys(index)).toStrictEqual(["Modal"]);
  expect(entryOf(index, "Modal").importFrom).toStrictEqual([
    PACKAGE,
    `${PACKAGE}/flr-universal`,
  ]);
});

test("keeps two different components of the same name apart", () => {
  const index = buildComponentIndex(
    [
      component("Link", "src/components/Link/Link.tsx"),
      component("Link", "src/integrations/nextjs/components/Link/Link.tsx"),
    ],
    {
      [`${PACKAGE}#Link`]: stable,
      [`${PACKAGE}/nextjs#Link`]: {
        level: "deprecated",
        isNew: false,
        deprecationNotice: "Use RouterProvider instead.",
      },
    },
    PACKAGE,
  );

  expect(Object.keys(index).sort()).toStrictEqual([
    `${PACKAGE}/nextjs#Link`,
    "Link",
  ]);
  expect(entryOf(index, "Link").level).toBe("stable");
  expect(index[`${PACKAGE}/nextjs#Link`]).toMatchObject({
    level: "deprecated",
    deprecationNotice: "Use RouterProvider instead.",
  });
});

test("carries isNew and marks deprecated props", () => {
  const index = buildComponentIndex(
    [
      component("Rating", "src/components/Rating/Rating.tsx", {
        status: prop({
          name: "status",
          description: "The status. @deprecated Use `color` instead.",
        }),
      }),
    ],
    { [`${PACKAGE}#Rating`]: { level: "beta", isNew: true } },
    PACKAGE,
  );

  expect(entryOf(index, "Rating")).toMatchObject({
    level: "beta",
    isNew: true,
    props: { status: { deprecated: true } },
  });
});

test("skips registry keys with no matching doc-properties entry", () => {
  const index = buildComponentIndex(
    [],
    { [`${PACKAGE}#Gone`]: stable },
    PACKAGE,
  );

  expect(index).toStrictEqual({});
});
