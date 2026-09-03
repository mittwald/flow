import { expect, test } from "vitest";
import {
  buildStatusRegistry,
  isComponentDisplayName,
  isUnderSourceRoot,
} from "./buildStatusRegistry";

const PKG = "@mittwald/flow-react-components";

// doc-properties fixtures (react-docgen returns filePath absolute OR relative).
const publicButton = {
  displayName: "Button",
  tags: {},
  filePath: "/abs/packages/components/src/components/Button/Button.tsx",
};
const publicLink = {
  displayName: "Link",
  tags: { "flr-generate": "all" },
  filePath: "/abs/packages/components/src/components/Link/Link.tsx",
};
const nextjsLink = {
  displayName: "Link",
  tags: { deprecated: "Use RouterProvider instead" },
  // relative on purpose — react-docgen emits this form for some files
  filePath: "src/integrations/nextjs/components/Link/Link.tsx",
};
const nextjsRouterProvider = {
  displayName: "RouterProvider",
  tags: {},
  filePath:
    "src/integrations/nextjs/components/RouterProvider/RouterProvider.tsx",
};

test("keys entries by `<specifier>#<name>` and derives status per source", () => {
  const registry = buildStatusRegistry(
    [publicButton, publicLink, nextjsLink],
    [
      {
        specifier: PKG,
        components: [
          { name: "Button", sourceRoot: "src/components" },
          { name: "Link", sourceRoot: "src/components" },
        ],
      },
      {
        specifier: `${PKG}/nextjs`,
        components: [{ name: "Link", sourceRoot: "src/integrations/nextjs" }],
      },
    ],
  );

  expect(registry).toEqual({
    [`${PKG}#Button`]: { level: "stable", isNew: false },
    [`${PKG}#Link`]: { level: "stable", isNew: false },
    [`${PKG}/nextjs#Link`]: {
      level: "deprecated",
      isNew: false,
      deprecationNotice: "Use RouterProvider instead",
    },
  });
});

test("skips a name with no source component under the entry's root", () => {
  // `.#RouterProvider` has no core doc (react-aria re-export); the nextjs one is
  // a different component and must not fill the `.` slot.
  const registry = buildStatusRegistry(
    [nextjsRouterProvider],
    [
      {
        specifier: PKG,
        components: [{ name: "RouterProvider", sourceRoot: "src/components" }],
      },
      {
        specifier: `${PKG}/nextjs`,
        components: [
          { name: "RouterProvider", sourceRoot: "src/integrations/nextjs" },
        ],
      },
    ],
  );

  expect(Object.keys(registry)).toEqual([`${PKG}/nextjs#RouterProvider`]);
});

test("flr-universal duplicates the `.` status under its own key", () => {
  const action = {
    displayName: "Action",
    tags: {},
    filePath: "/abs/packages/components/src/components/Action/Action.tsx",
  };
  const registry = buildStatusRegistry(
    [action],
    [
      {
        specifier: PKG,
        components: [{ name: "Action", sourceRoot: "src/components" }],
      },
      {
        specifier: `${PKG}/flr-universal`,
        components: [{ name: "Action", sourceRoot: "src/components" }],
      },
    ],
  );

  expect(registry[`${PKG}#Action`]).toEqual({ level: "stable", isNew: false });
  expect(registry[`${PKG}/flr-universal#Action`]).toEqual({
    level: "stable",
    isNew: false,
  });
});

test("drops non-component names (lowercase barrel segments)", () => {
  const registry = buildStatusRegistry(
    [publicButton],
    [
      {
        specifier: PKG,
        components: [
          { name: "icons", sourceRoot: "src/components" },
          { name: "Button", sourceRoot: "src/components" },
        ],
      },
    ],
  );

  expect(Object.keys(registry)).toEqual([`${PKG}#Button`]);
});

test.each([
  ["/abs/x/src/components/Link/Link.tsx", "src/components", true],
  ["src/components/Link/Link.tsx", "src/components", true],
  ["src\\integrations\\nextjs\\Link.tsx", "src/integrations/nextjs", true],
  ["/abs/src/components/Link/Link.tsx", "src/integrations/nextjs", false],
  [undefined, "src/components", false],
] as const)("isUnderSourceRoot(%s, %s) === %s", (filePath, root, expected) => {
  expect(isUnderSourceRoot(filePath, root)).toBe(expected);
});

test.each([
  ["Button", true],
  ["YAxis", true],
  ["useContextIcon", false],
  ["icons", false],
  ["", false],
] as const)("isComponentDisplayName(%s) === %s", (name, expected) => {
  expect(isComponentDisplayName(name)).toBe(expected);
});
