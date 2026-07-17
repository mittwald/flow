# @mittwald/flow-react-components — Agent Guide

Component patterns for the core package. Read the
[root AGENTS.md](../../AGENTS.md) first for repo-wide rules (generated code,
Definition of Done, workflow).

> **Full pattern catalog:** [PATTERNS.md](./PATTERNS.md) lists every convention
> (182 patterns) with per-pattern applicability (when to use / when not), a
> canonical example each, and a decision cheat-sheet. This guide covers the
> must-know core; look there when deciding between two approaches.

## Component anatomy

```
src/components/Button/
├── Button.tsx               # implementation (hand-written)
├── Button.module.scss       # styles (hand-written)
├── index.ts                 # barrel (hand-written)
├── view.ts                  # GENERATED — remote view declaration (@flr-generate only)
├── stories/
│   ├── Default.stories.tsx  # Storybook stories (expected for every component)
│   └── lib.tsx              # shared story fixtures/helpers (optional)
├── components/              # subcomponents, same anatomy (optional)
├── locales/                 # de-DE.locale.json + en-US.locale.json (when UI text)
└── *.browser.test.tsx       # behavior tests (when behavior is non-trivial)
```

The barrel exports the view first (only on `@flr-generate` components), then
the component:

```ts
export * from "./view";
export { type ButtonProps, Button } from "./Button";
export { default } from "./Button";
```

## The flowComponent factory

Nearly every component registers through
`flowComponent(name, Implementation, options?)`
(`src/lib/componentFactory/flowComponent.tsx`). It wires up the props context,
tunnel support, `wrapWith`, and remote isolation — do not rebuild any of that
manually.

```tsx
import type { PropsWithChildren } from "react";
import type Aria from "react-aria-components";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface ButtonProps
  extends PropsWithChildren<Omit<Aria.ButtonProps, "children">>,
    FlowComponentProps<HTMLButtonElement> {
  /** The color of the button. @default "primary" */
  color?: "primary" | "accent" | "secondary" | "danger";
}

/** @flr-generate all */
export const Button = flowComponent("Button", (props) => {
  const { color = "primary", className, ref, ...rest } = props;
  // …
});

export default Button;
```

Conventions:

- Props type is exported as `<Name>Props`; it extends the wrapped React Aria
  props plus `FlowComponentProps<RefElement>`.
- **Ref as prop** (React 19) — no `forwardRef`.
- `options.type`: `"ui"` (default — gets props-context isolation),
  `"layout"`, or `"provider"`. The factory applies `ClearPropsContext`
  isolation for UI components itself — don't add extra clearing casually.
- The registered name must match the component/directory name, and the props
  type must be registered in `src/components/propTypes/index.ts`
  (`FlowComponentPropsTypes`) — `flowComponent` names are typed as `keyof`
  of that hand-maintained registry, so a missing entry fails the typecheck.
- Most components wrap `react-aria-components` primitives; expose ARIA props
  directly only where React Aria lacks the behavior.

## PropsContext — contextual composability

`PropsContext` makes components adapt **automatically** when composed inside
other components: they receive default prop values and, mainly, CSS classes
from their surroundings. This is the backbone of Flow's composability.

```tsx
// IllustratedMessage.tsx — every <Icon> inside renders large:
const propsContext: PropsContext = {
  Icon: { className: styles.icon, size: "l" },
  Heading: { className: styles.heading, color },
};

return (
  <div {...rest}>
    <PropsContextProvider props={propsContext}>{children}</PropsContextProvider>
  </div>
);
```

- Contexts **nest** (a context can configure props contexts of nested
  components) and support **dynamic props**:
  `dynamic((localProps) => value)` derives values from the consumer's props.
- Local props always win over context props.
- Although exported, `PropsContext` is **primarily an internal API** — prefer
  it for intra-Flow composition, not as a consumer-facing feature.
- **Only put remote-capable components into a `PropsContext`** — non-remote
  components break remote rendering.
- When parent context must not leak into a component's children, use targeted
  clearing, e.g. `wrapWith: <ClearPropsContext />` (see `Modal.tsx`).

## Views — remote-transparent composition

Components tagged `/** @flr-generate all */` get a generated view
(`view.ts` + `src/views/<Name>View.tsx`). **Inside `flr-universal` components,
compose other Flow components through their views** (`@/views/*`) — a view
automatically switches to the remote counterpart in a remote context:

```tsx
import ButtonView from "@/views/ButtonView";   // ✓ works local and remote
import { Button } from "@/components/Button";  // ✗ host-only in remote context
```

Remote generation details:

- `@flr-generate all` on the component const marks it for generation.
- `@flr-ignore-props` excludes props that must not cross the remote boundary —
  either because they cannot be serialized, or because they could do **too
  much on the host side**. A global ignore list lives in
  `dev/remote-components-generator/config.ts`: `style` and
  `dangerouslySetInnerHTML` are always ignored for safety; `ref`,
  `controller`, `tunnel`, `key`, `children`, `wrapWith` because they don't
  serialize. Use the per-component tag for additional cases (see
  `TunnelEntry.tsx`).
- After changing props of an `@flr-generate` component:
  `pnpm nx build:remote-components components` and **commit** the results
  (view.ts, `src/views/*`, `remote-*/src/auto-generated/**`).
- Props of these components are consumed by mStudio extension developers —
  no breaking changes; deprecate instead:

```tsx
const warnDeprecation = useWarnDeprecation();
if ("action" in props) {
  warnDeprecation("The 'action' prop is deprecated. Use 'onAction' instead.");
}
```

## Styling

- One `<Name>.module.scss` per component. Scoped class names are generated
  from the component's **path** (`dev/vite/cssModuleClassNameGenerator.ts`) —
  deliberately semantic CSS that could be used standalone. Never bypass CSS
  modules for component roots (the global reset targets `flow--` classes).
- Root class is the lower-camel component name (`.button`); modifier classes
  match prop values (`.size-s`, `.primary`).
- Class composition with `clsx`, consumer `className` appended last:
  `clsx(styles.button, styles[size], styles[color], className)`.
- **Use design-token CSS variables** — global (`--font-size-text--m`) or
  component-namespaced (`--button--corner-radius`). No hard-coded colors,
  sizes, radii.
- Shared mixins via `@use "@/styles/mixins/…"`: `focus` (focus ring),
  `formControl` (border/color/interaction states of form fields), `ellipsis`.
  Group repeated variants in local mixins.
- Structure sections with comments: `/* Elements */`, `/* States */`,
  `/* Size */`, `/* Variants */`.

## Testing — the actual bar

| Artifact | When |
| --- | --- |
| `stories/Default.stories.tsx` | **Always.** Realistic args, controls, meaningful variants. Story title category matches the docs (`Actions/…`, `Form Controls/…`, `Overlays/…`, `Status/…`). |
| `*.browser.test.tsx` (vitest browser mode) | Component has real **behavior**: interaction, controlled state, async flows, form integration, controllers. Render with `vitest-browser-react`, interact via `userEvent`, query by role. |
| `*.test.ts(x)` (unit) | Pure logic in `src/lib/` or component utility functions. |
| `*.test-types.tsx` | Generic/typed public APIs — `expectTypeOf` plus `@ts-expect-error` negative assertions. |

Run: `pnpm nx test:unit components`,
`pnpm nx test:browser components --browser.name=webkit`. Browser tests need
`pnpm test:browser:prepare` once.

## i18n & a11y

- Component-internal UI text lives in colocated `locales/de-DE.locale.json`
  **and** `locales/en-US.locale.json` — always add both languages. The
  strings support ICU MessageFormat (variables, `plural`, `select` — see
  `PasswordCreationField/locales/` for real usage). Import the files with a
  glob import and consume them via the Flow hook:

  ```tsx
  import locales from "./locales/*.locale.json";
  import { useLocalizedStringFormatter } from "@/components/TranslationProvider";

  const stringFormatter = useLocalizedStringFormatter(locales, "Modal");
  ```

- Introducing a **new language** is welcome — but translate everything
  initially: every `locales/` directory in the package gets the new file.
- Icon-only buttons get a localized `aria-label`; decorative icons are
  `aria-hidden` (the `Icon` component handles this when no label is given).
- Form fields wire label/description/error via `useFieldComponent`
  (generates ids, sets `aria-describedby`).

## Public API surfaces

| Export | Contents |
| --- | --- |
| `.` (default) | Everything listed **manually** in `src/components/public.ts` — new public components must be added there. |
| `./internal` | Advanced internals (`flowComponent`, prop helper types, …). |
| `./flr-universal` | Curated subset that works local *and* remote. Adding to `public.ts` does **not** add here. |
| `./nextjs`, `./react-hook-form`, `./password-tools` | Integrations (`src/integrations/`): wrappers around third-party dependencies that not every consumer should pay for — they get their own export entry instead of entering the core surface. |
| `./all.css` | Bundled stylesheet. |
| `./doc-properties` | Generated prop metadata for the docs site. |

Prop JSDoc feeds the generated `doc-properties.json` and the docs site: write
doc comments on public props, use `@default` for defaults and `@internal` for
props to hide.

## Misc

- Feature flags: `src/flags.ts` holds a few behavior toggles; there is no
  formal policy around them.
- `SettingsProvider` (`src/components/SettingsProvider/`) is the built-in
  persistence for component settings (e.g. `List` remembering its view
  settings), with pluggable backends (localStorage by default). Internal
  component infrastructure — extension developers don't need it.
- `stories/lib.tsx` holds story-only fixtures — never import it from
  component code.
- Storybook discovers all `src/**/*.stories.tsx` automatically; there is no
  registry to update.

## Non-obvious conventions

Easy-to-miss conventions not spelled out above. Full details and examples in
[PATTERNS.md](./PATTERNS.md).

- **`PropsContext` is structural, not just styling** — nested entries,
  `dynamic` children, semantic defaults (icon size, heading level, status), and
  contextual `wrapWith` define much of a composite's internal API.
- **The factory supplies hidden infrastructure** — memoization, nested-context
  preservation, slot propagation, UI isolation, and tunnel entry/provider
  wiring are all automatic consequences of `flowComponent`; don't rebuild them.
- **Raw string children get `Text`-normalized** where typography is
  context-driven (detect raw strings, wrap in `Text`); explicit structured
  children are left intact.
- **Semantic generated CSS classes are coordination points** — scoped modules
  still use `:global(.flow--…)` when independently rendered Flow descendants
  must affect layout.
- **Controllers coexist with declarative props** — overlay-like APIs support
  controlled/uncontrolled props *and* a controller object, not one or the other.
- **Complex behavior is split by vocabulary** — `components/` for render,
  `hooks/` for behavior, `lib/` for pure transforms, `models/` for durable
  state.
- **`SettingsProvider` combines async resources, hierarchical MobX stores, and
  serialized, Suspense-aware writes** — reuse it rather than rolling
  persistence.
- **The empty `Default` story is intentional** — realistic args and rendering
  live in the typed `meta`, so `export const Default: Story = {}` is the norm.
- **CSS leans on modern relational/low-specificity selectors** — `:has`,
  `:where`, logical properties, data attributes, and container boundaries
  reduce the need for runtime styling props.
- **Universal exports are deliberately explicit** — remote-safe values and
  their types are curated in `flr-universal.ts` independently of the main
  public surface; adding to `public.ts` does not add them there.
