# @mittwald/flow-react-components — Pattern Reference

A reference catalog of the coding patterns and conventions used in this package,
each with **when it applies (✓)** and **when it does not (✗ → use instead)**.
Use it to write a new component that looks native to the package, or to decide
between two similar approaches.

This complements [AGENTS.md](./AGENTS.md) (the authoritative rules) — patterns
marked `[undocumented]` are observed conventions not spelled out there. Each
entry cites one canonical `Example:` (path relative to this package); `cf.`
marks a verified counter-example that clarifies the "✗" branch.

Paths and line numbers drift as code changes — treat them as starting points,
not guarantees. Never edit generated files (`view.ts`, `src/views/`,
`src/auto-generated/`, `Icon/components/icons/`).

> Jump to the [Decision cheat-sheet](#decision-cheat-sheet) for the
> highest-frequency choices.

---

## Guiding principles

The **why** behind the concrete rules below. When a specific pattern is unclear
or a new situation isn't covered, fall back to these; the numbered sections are
these principles applied. (`→` points to the sections each one mostly governs.)

1. **Composition is the architecture.** `PropsContext` is the backbone —
   components adapt to their surroundings automatically (classes, icon size,
   heading level) instead of the consumer wiring everything. When a parent
   shapes its descendants, do it through context, not child-cloning or
   prop-drilling. → §3.
2. **Build on standards; don't reinvent accessibility.** Nearly everything wraps
   `react-aria-components`; expose ARIA directly only where react-aria has a
   gap. Accessibility is non-negotiable: semantic roots, labels for icon-only
   controls, `aria-hidden` for decoration, generated `id` / `aria-describedby`.
   → §1, §8.
3. **A factory hides the infrastructure — convention over configuration.**
   `flowComponent` supplies memoization, context isolation, slot/tunnel wiring,
   and `wrapWith`; never rebuild it by hand. Ref-as-prop (no `forwardRef`),
   forward `...rest`, defaults in destructuring. The payoff: every component
   looks the same. → §1.
4. **Single source of truth; generate what's derivable.** Tokens, views, icons,
   the `propTypes` registry, and doc-properties are generated and committed,
   never hand-maintained twice. (It's why this catalog is _referenced_ from
   `AGENTS.md`, not duplicated into it.) → §4, §5.
5. **The public API is a contract — extend, don't break.** Export surfaces
   (`public.ts`, `flr-universal.ts`, `internal.ts`) are curated by hand. Remote
   props for extension developers are additive; deprecate with
   `useWarnDeprecation` instead of renaming/removing. JSDoc + `@default` /
   `@internal` _is_ the API's documentation. → §5, §2, §4.
6. **Design comes from UX — base tokens are taboo.** Never hard-code
   colors/sizes/radii; compose existing design tokens, and add component tokens
   only with an established design. → §6.
7. **TypeScript is a contract, kept precise.** `interface` for a component's own
   extensible prop shape; a `type` alias for
   intersections/`Omit`/`Pick`/generics. Types are tested (`*.test-types.tsx`),
   and names derive from the registry rather than parallel unions. → §2, §11.
8. **Enforce consistency with tooling, not discipline.** Prefer an
   ESLint/Prettier rule + autofix over hundreds of hand edits. Write
   self-explanatory code with minimal comments. → §12.
9. **Colocate by role.** `components/` (render), `hooks/` (behavior), `lib/`
   (pure transforms), `models/` (durable state), `locales/`, `stories/`.
   Cross-cutting imports use the `@/` alias; a component's own feature stays
   relative. → §7, §12.
10. **Effort scales with risk.** Testing bar: a story always, a browser test for
    real behavior, a unit test for pure logic, a type test for generics. i18n
    always ships both `de-DE` and `en-US` (ICU). Reach for modern CSS (`:where`,
    `:has`, logical properties, container queries, `data-*` state) before adding
    runtime styling props. → §11, §9, §6.

**In one sentence:** composable, accessibility-first React components built on
react-aria, unified by a factory, backed by a generated single source of truth,
with a public API treated as a contract and visual design driven by UX tokens —
and consistency enforced by tooling, not maintained by hand.

---

## 1. Component definition

- **Factory registration** — public Flow components via
  `flowComponent("<Name>", impl)`; the registered name matches the component and
  directory. `src/components/Button/Button.tsx:91`
  - ✓ public components needing registry, context, tunnel, or remote behavior.
  - ✗ internal implementation details → plain function/FC
    (`src/components/DonutChart/components/DonutChartFill.tsx:14`).
- **UI component default** — omit factory options; `"ui"` is the default and
  isolates internals from inherited props contexts.
  `src/lib/componentFactory/flowComponent.tsx:58`
  - ✓ leaf controls and content that must isolate inherited PropsContext.
  - ✗ structural containers or context owners → layout/provider classification.
- **Layout classification** — `{ type: "layout" }` for transparent
  layout/composition primitives whose descendants stay context-aware.
  `src/components/LayoutCard/LayoutCard.tsx:41`
  - ✓ arranges or wraps descendant UI without isolating contextual props.
  - ✗ leaf UI or context infrastructure → UI/provider.
- **Provider classification** — `{ type: "provider" }` for trigger/provider
  components.
  `src/components/Popover/components/PopoverTrigger/PopoverTrigger.tsx:22`
  - ✓ primary role is establishing behavior/context around descendants.
  - ✗ visual leaves or structural layout → UI/layout.
- **Factory memoization** — factory implementations and registered components
  are memoized automatically; components don't add `memo` themselves.
  `src/lib/componentFactory/flowComponent.tsx:60`
  - ✓ factory-registered components.
  - ✗ deliberately outside the factory → manual memo only when profiling
    justifies it.
- **Ref as a prop** — destructure `ref`, pass to the DOM/Aria primitive; no
  `forwardRef`. `src/components/Button/Button.tsx:104`
  - ✓ exposing the root/Aria element (React 19).
  - ✗ no meaningful public element ref → omit it; never `forwardRef`.
- **Rest-prop forwarding** — keep `...rest` and forward to the semantic
  root/wrapped primitive. `src/components/Button/Button.tsx:109`
  - ✓ props inherited from the rendered primitive belong on its root.
  - ✗ props consumed by composition or incompatible with the root →
    destructure/translate them.
- **Defaults in destructuring** — runtime defaults where props are destructured,
  synced with JSDoc `@default`. `src/components/Button/Button.tsx:94`
  - ✓ optional props with a stable default.
  - ✗ controlled values or defaults where absence has distinct semantics →
    preserve `undefined`.
- **Derived `rootClassName` variable** `[undocumented]` — compute the root class
  expression before JSX rather than inline.
  `src/components/Button/Button.tsx:112`
  - ✓ root styling combines base, variants, state, and consumer classes.
  - ✗ a single invariant class → pass it directly.
- **Helpers outside the component** `[undocumented]` — hookless pure
  helpers/constants live above the component const.
  `src/components/Button/Button.tsx:45`
  - ✓ pure logic independent of hooks/render state.
  - ✗ needs props/hooks/closures → keep inside or extract a hook.
- **Remote generation marker** — `/** @flr-generate all */` directly above the
  exported const. `src/components/Button/Button.tsx:90`
  - ✓ public components on the `flr-universal` remote contract.
  - ✗ host-only/internal/non-serializable → omit generation and keep off the
    universal surface.
- **Conditional structural wrapper (`Wrap`)** `[undocumented]` — optional
  wrapper without duplicating the child subtree.
  `src/components/Button/Button.tsx:187`
  - ✓ existing content needs an optional wrapper.
  - ✗ wrapping every factory instance context-wide → factory-level `wrapWith`.
- **Factory-level `wrapWith`** — clone a wrapper around the whole registered
  component. `src/lib/componentFactory/flowComponent.tsx:127`
  - ✓ a component type must consistently establish/clear infrastructure.
  - ✗ a wrapper depends on one render's condition → `Wrap` in the body.
- **Named plus default export** — named const + trailing `export default Name`.
  `src/components/Button/Button.tsx:200`
  - ✓ principal public components (support both conventions).
  - ✗ internal helpers → smallest local export surface.
- **Plain FC exception** `[undocumented]` — small infra/provider/SSR/structural
  utilities may use `FC`/plain function.
  `src/components/SettingsProvider/SettingsProvider.tsx:21`
  - ✓ internal infra needing none of the factory services.
  - ✗ normal public UI/layout/provider → `flowComponent`.

## 2. Props typing

- **Public props interface** — exported `<Name>Props` interface.
  `src/components/Button/Button.tsx:17`
  - ✓ a public component owns an extensible named contract.
  - ✗ the contract is chiefly an intersection/transform → type alias.
- **React Aria inheritance** — extend the wrapped `react-aria-components` props.
  `src/components/Button/Button.tsx:19`
  - ✓ wraps an Aria primitive and preserves its accessible API.
  - ✗ renders a native element w/o Aria analogue → native element props.
- **Element-typed Flow props** — add `FlowComponentProps<RootElement>` for
  ref/wrapWith/tunnel. `src/components/Button/Button.tsx:20`
  - ✓ consumers may class/slot/tunnel/wrap/ref a specific root element.
  - ✗ no stable public root element → unparameterized helper / narrower
    contract.
- **Default Flow ref element** `[undocumented]` — omit the generic when the root
  ref is `HTMLDivElement`. `src/components/Badge/Badge.tsx:33`
  - ✓ root uses the helper's default element type.
  - ✗ another root element → provide the actual type.
- **Children normalization** — `PropsWithChildren`, often `Omit`-ing the Aria
  `children` first. `src/components/FieldError/FieldError.tsx:19`
  - ✓ the inherited `children` type conflicts with plain `ReactNode`
    composition.
  - ✗ render-prop children are intentionally supported → keep the upstream type.
- **Class-name helper (`PropsWithClassName`)** — for contracts needing
  `className` but not full element props.
  `src/components/Initials/Initials.tsx:12`
  - ✓ needs `className` only.
  - ✗ a factory component already extends `FlowComponentProps` → redundant.
- **Native element inheritance** `[undocumented]` — non-Aria wrappers extend
  `ComponentProps<"el">`/`HTMLAttributes`.
  `src/components/Navigation/Navigation.tsx:15`
  - ✓ thin semantic HTML wrapper.
  - ✗ an Aria primitive supplies the behavioral contract → inherit its props.
- **Type alias for composition** `[undocumented]` — use `type` for
  intersection/`Omit`/`Pick`/generic/alias shapes.
  `src/components/FileCardList/FileCardList.tsx:10`
  - ✓ props are chiefly transforms of sibling contracts.
  - ✗ a public component introduces its own extensible fields → interface.
- **Internal local props (`Props`)** `[undocumented]` — private, unexported
  subcomponent props named `Props`.
  `src/components/DonutChart/components/DonutChartFill.tsx:7`
  - ✓ a private implementation component.
  - ✗ consumer-facing → export `<Name>Props`.
- **Literal vocabulary from arrays** `[undocumented]` — `as const` array +
  `(typeof x)[number]` union. `src/components/Badge/Badge.tsx:18`
  - ✓ runtime iteration/validation and a compile-time union share one source.
  - ✗ values exist only at type level → literal union.
- **Generic Aria value types** `[undocumented]` — preserve the wrapped generic
  value type + a sensible default. `src/components/TimeField/TimeField.tsx:12`
  - ✓ the public value/selection type must flow through props/callbacks.
  - ✗ one fixed value type → non-generic contract.
- **Supported-prop subsets (`Pick`)** `[undocumented]` — expose an unchanged
  subset of a larger API. `src/components/Modal/Modal.tsx:23`
  - ✓ deliberately exposing an unchanged subset.
  - ✗ inherited fields need changed semantics/types → `Omit` + replacements.
- **Inherited-prop replacement (`Omit`)** `[undocumented]` — retain a prop name
  but change its type/meaning. `src/components/ComboBox/ComboBox.tsx:22`
  - ✓ Flow changes the accepted type/meaning of a wrapped prop.
  - ✗ semantics identical → inherit or `Pick`.
- **Shared semantic prop helpers** — reuse
  `PropsWithStatus`/`PropsWithElementType`/`AlphaColor`… from
  `src/lib/types/props`. `src/lib/types/props.ts:14`
  - ✓ multiple components share the same public vocabulary.
  - ✗ a concept is component-specific → keep it beside that component.
- **Polymorphic element helper** `[undocumented]` — `PropsWithElementType` =
  HTML attrs + constrained tag/exotic. `src/lib/types/props.ts:32`
  - ✓ consumers may choose the semantic root with matching native typing.
  - ✗ behavior/a11y needs one fixed element → fixed root.
- **Internal prop documentation (`@internal`)** — hides exposed-but-internal
  members from generated docs. `src/components/Button/Button.tsx:39`
  - ✓ a technically exposed prop must be hidden from consumer docs.
  - ✗ a consumer should choose it → document normally.
- **Documented defaults (`@default`)** — in public prop JSDoc, synced with
  runtime. `src/components/Button/Button.tsx:23`
  - ✓ a stable observable default.
  - ✗ meaningful `undefined` or a dynamic/contextual default → describe
    semantics instead.
- **Remote prop exclusion (`@flr-ignore-props`)** — for
  non-serializable/host-sensitive props.
  `src/components/TunnelEntry/TunnelEntry.tsx:9`
  - ✓ a prop can't safely/meaningfully cross the remote boundary.
  - ✗ serializable + part of the contract → generate it.
- **Props registry registration** — every `flowComponent` name + props type in
  `FlowComponentPropsTypes`. `src/components/propTypes/index.ts:97`
  - ✓ every factory component.
  - ✗ plain internal FCs → do not register.
- **Registry-derived component names** `[undocumented]` — derive
  `FlowComponentName`/props from the registry.
  `src/components/propTypes/types.ts:3`
  - ✓ factory/context APIs accept only registered names.
  - ✗ arbitrary DOM/third-party names → type them in their own domain.

## 3. PropsContext / composability

- **Typed context map** — `const propsContext: PropsContext` keyed by component
  names. `src/components/Button/Button.tsx:140`
  - ✓ a composition supplies defaults/styling to known Flow descendants.
  - ✗ arbitrary DOM/third-party → props or their own context.
- **Provider around composition slots** — wrap only the descendant region.
  `src/components/Button/Button.tsx:186`
  - ✓ user-supplied descendants must adapt to the parent.
  - ✗ no compositional slot → pass props directly.
- **Local props win** — context values are contextual defaults; explicit props
  override. `src/lib/hooks/useProps.ts:32`
  - ✓ defaults while preserving explicit consumer intent.
  - ✗ an enforced invariant → render it directly.
- **Contextual styling** — inject nested components' CSS-module classes via
  context. `src/components/Button/Button.tsx:140`
  - ✓ descendant Flow components need slot-specific classes without cloning.
  - ✗ styling targets ordinary DOM → parent CSS module.
- **Contextual semantic defaults** `[undocumented]` — context sets icon size,
  heading level, status, etc. `src/components/Button/Button.tsx:141`
  - ✓ a sensible overridable element/level/size/variant.
  - ✗ the value is required for correctness → configure explicitly.
- **Nested component contexts** — nest keys to configure descendants of a
  composed component. `src/components/Modal/Modal.tsx:107`
  - ✓ a descendant composition must configure components inside itself.
  - ✗ only the immediate descendant changes → flat entry.
- **Reusable context fragments** `[undocumented]` — extract repeated nested
  structure, spread into entries. `src/components/Modal/Modal.tsx:105`
  - ✓ several branches share an identical policy.
  - ✗ values differ or are used once → inline.
- **Dynamic contextual props** — `dynamic(localProps => value)`.
  `src/components/Modal/Modal.tsx:131`
  - ✓ a contextual value derives from the descendant's local props.
  - ✗ constant or parent-state-only → static value/closure.
- **Contextual wrappers** — `wrapWith` inside a context entry wraps every
  matching descendant. `src/components/Modal/Modal.tsx:126`
  - ✓ every matching descendant needs a wrapper.
  - ✗ one explicitly rendered node → wrap it directly.
- **Targeted context clearing (`ClearPropsContext`)** — for subtrees that must
  not inherit. `src/lib/propsContext/components/ClearPropsContext.tsx:9`
  - ✓ selected descendants must not inherit a parent context while other context
    stays useful.
  - ✗ normal UI isolation → rely on automatic isolation.
- **Automatic UI isolation** — factory clears inherited context for `"ui"`.
  `src/lib/componentFactory/flowComponent.tsx:94`
  - ✓ UI-classified components.
  - ✗ layout/provider must propagate context → classify accordingly.
- **Context preservation through factory** `[undocumented]` — re-provides own
  nested context before isolation.
  `src/lib/componentFactory/flowComponent.tsx:88`
  - ✓ layout/provider stay transparent to upstream composability.
  - ✗ UI leaves isolate automatically.
- **Automatic slot propagation** `[undocumented]` — a string `slot` prop
  installs `SlotContextProvider`.
  `src/lib/componentFactory/flowComponent.tsx:119`
  - ✓ factory components expose `slot` for composition/tunnel routing.
  - ✗ a plain FC → pass any discriminator explicitly.
- **UI tunnel entry** `[undocumented]` — the `tunnel` prop becomes
  `UiComponentTunnelEntry`. `src/lib/componentFactory/flowComponent.tsx:131`
  - ✓ a UI component may be captured and rendered at a tunnel exit.
  - ✗ ordinary in-place children → render normally.
- **Tunnel exit in composition slots** `[undocumented]` —
  `UiComponentTunnelExit` at named insertion points.
  `src/components/Select/Select.tsx:98`
  - ✓ a parent owns a named slot whose UI originates deeper in the tree.
  - ✗ simple composition → children/PropsContext.
- **Tunnel provider around UI/layout** `[undocumented]` — auto tunnel identity
  for `"ui"`/`"layout"`. `src/lib/componentFactory/flowComponent.tsx:80`
  - ✓ factory UI/layout components.
  - ✗ providers/plain FCs without tunnel behavior → don't add manually.
- **Only remote-capable context targets** — PropsContext keys used for
  composition must have remote counterparts.
  - ✓ generated/remote-capable Flow components.
  - ✗ host-only components → pass props / redesign for views
    (`src/components/Badge/Badge.tsx:13`).

## 4. Views / remote

- **View imports for universal composition** — in `flr-universal` components
  import from `@/views/*`. `src/components/Modal/Modal.tsx:16`
  - ✓ composing a Flow component that must switch local/remote.
  - ✗ host-only → direct component import.
- **Host-only direct imports** — `@/components/*` composition.
  `src/components/Badge/Badge.tsx:13`
  - ✓ deliberately host-only / internal host infra.
  - ✗ universal composition → import the view.
- **Generated view exclusion** — `view.ts`/`src/views/*` are generator output.
  - ✓ consumed and regenerated via tooling.
  - ✗ fixes → edit the source component/generator, never the view.
- **Remote-safe props contract** — additions over replacement/removal on
  `@flr-generate` props.
  - ✓ generated props are serializable, least-privilege, backward-compatible.
  - ✗ host-only/non-serializable → ignore remotely or stay host-only.
- **Deprecation warning hook (`useWarnDeprecation`)** — warn on legacy prop
  usage, keep supporting it.
  `src/components/CartesianChart/CartesianChart.tsx:59`
  - ✓ a shipped remote prop/API must keep working while guiding to its
    replacement.
  - ✗ unshipped/internal API → change directly.
- **Controlled remote adapter** `[undocumented]` — shared hooks bridge
  serialized value/callbacks. `src/lib/remote/useControlledHostValueProps.ts:23`
  - ✓ host and remote sides must synchronize a controlled value/events.
  - ✗ purely local or ordinary controlled props → standard handling.
- **Remote-safe child text extraction** `[undocumented]` — remote-aware helpers,
  not raw child structure. `src/components/Button/Button.tsx:176`
  - ✓ behavior needs text from possibly-remote children.
  - ✗ guaranteed local strings → ordinary React handling.
- **Remote isolation distinction** `[undocumented]` — host impls use local+view
  clear wrappers; remote only local.
  `src/lib/componentFactory/flowComponent.tsx:99`
  - ✓ remote render contexts need isolation distinct from local clearing.
  - ✗ host-only rendering → normal factory isolation.

## 5. Exports / barrels

- **View-first barrel** — generated components export `./view` first.
  `src/components/Button/index.ts:1`
  - ✓ a generated component barrel.
  - ✗ non-generated → omit the view export.
- **Type-first named export** — `export { type ButtonProps, Button }`.
  `src/components/Button/index.ts:3`
  - ✓ a barrel exposes props + named component.
  - ✗ internal modules → export only what callers need.
- **Trailing default re-export** — `export { default } from "./Name"`.
  `src/components/Button/index.ts:4`
  - ✓ the principal component (default-import compatibility).
  - ✗ utility-only barrels → no default.
- **Combined default/named variant** `[undocumented]` — tiny barrels:
  `export { Name, default } from "./Name"`.
  `src/components/BrowserOnly/index.ts:1`
  - ✓ a tiny barrel re-exporting one symbol both ways without types.
  - ✗ components with props/view exports → expanded form.
- **Manual public surface** — add to `src/components/public.ts` explicitly.
  `src/components/public.ts:18`
  - ✓ intentionally supported from the package root.
  - ✗ internal/experimental → keep out.
- **Alias-based public exports** `[undocumented]` — surfaces export via
  `@/components/...`. `src/components/public.ts:1`
  - ✓ a compatibility/clearer consumer-facing name.
  - ✗ no conflict/migration → canonical name.
- **Curated universal surface** — add remote-safe APIs to
  `src/index/flr-universal.ts` separately. `src/index/flr-universal.ts:3`
  - ✓ verified to work local + remote.
  - ✗ merely public → leave out until remote-capable.
- **Explicit universal type/value pairs** `[undocumented]` — name each
  component + props, no wildcard. `src/index/flr-universal.ts:8`
  - ✓ universal consumers need value + props.
  - ✗ implementation types → don't expose.
- **Internal surface** — factories/context/helper types via
  `src/index/internal.ts`. `src/index/internal.ts:3`
  - ✓ advanced infra intentionally available but not the ordinary API.
  - ✗ normal components → default public surface.
- **Subcomponent barrels** `[undocumented]` — composable subcomponents get their
  own `index.ts`.
  - ✓ a reusable/independently imported subcomponent.
  - ✗ a tiny single-use detail → colocated file, no dir barrel
    (`src/components/DonutChart/components/DonutChartFill.tsx:1`).
- **Separate integration entries** — optional-dep adapters under
  `src/integrations/`. `src/integrations/nextjs/index.ts:1`
  - ✓ brings optional third-party deps or framework-specific behavior.
  - ✗ dependency-free core → normal surface.
- **Story-only fixture boundary** — `stories/lib.tsx` never imported by
  production code.
  - ✓ helpers solely for constructing stories.
  - ✗ production logic → component/shared library.

## 6. Styling

- **Colocated CSS module** — `<Name>.module.scss` imported as `styles`.
  `src/components/Button/Button.tsx:2`
  - ✓ a visual component owns scoped styles.
  - ✗ a behavior-only provider/helper → omit.
- **Lower-camel root class** — root class named after the component.
  `src/components/Button/Button.module.scss:5`
  - ✓ the module's principal root.
  - ✗ nested elements/modifiers → name by role/value.
- **Semantic modifier classes** — `.solid`, `.primary`, `.isPending`, `.size-s`.
  `src/components/Button/Button.module.scss:76`
  - ✓ a prop/state maps to a reusable semantic variant.
  - ✗ a one-off derived numeric value → CSS custom property/inline.
- **Consumer class last** — `clsx(root, modifiers…, className)`.
  `src/components/Button/Button.tsx:114`
  - ✓ combines internal + consumer classes on the root.
  - ✗ no public `className` → internal classes only.
- **Conditional boolean classes** — short-circuit expressions, not ad-hoc
  strings. `src/components/Button/Button.tsx:116`
  - ✓ a boolean state changes styling without structure.
  - ✗ selecting among named variants → variant lookup.
- **Bracket lookup for hyphenated classes** `[undocumented]` —
  `styles["size-s"]` / `styles[value]`. `src/components/Button/Button.tsx:119`
  - ✓ a generated class key has hyphens or is dynamic.
  - ✗ a valid static identifier → dot notation.
- **Design-token variables** — global + component-prefixed tokens; no hard-coded
  colors/sizes/radii. `src/components/Button/Button.module.scss:8`
  - ✓ colors/spacing/type/radii/shadow/size.
  - ✗ a structural CSS keyword or genuine calculation → CSS directly.
- **No invented base values** — compose existing tokens; add component tokens
  only with a design.
  - ✓ values composed from approved tokens.
  - ✗ a missing design decision → ask UX / add an approved component token.
- **Shared `focus` mixin** — `@use "@/styles/mixins/focus"`.
  `src/components/Button/Button.module.scss:32`
  - ✓ an interactive element needs the system focus ring.
  - ✗ non-interactive → no focus treatment.
- **Shared `formControl` mixin** — standard field border/color/states.
  `src/components/CodeEditor/CodeEditor.module.scss:1`
  - ✓ a field-like control.
  - ✗ non-form interactive UI → its relevant styling.
- **Shared `ellipsis` mixin** — single-line truncation.
  `src/components/Badge/Badge.module.scss:2`
  - ✓ single-line truncation with system overflow.
  - ✗ content may wrap / stay fully visible → normal wrapping.
- **Specialized shared mixins** `[undocumented]` — `menuItem`, `avatarButton`,
  container-breakpoint. `src/components/Navigation/Navigation.module.scss:1`
  - ✓ multiple components repeat a domain pattern.
  - ✗ local to one component → local mixin.
- **SCSS section comments** — `/* Elements */`, `/* States */`, `/* Size */`,
  `/* Variants */`. `src/components/Button/Button.module.scss:37`
  - ✓ a non-trivial module with distinct sections.
  - ✗ a tiny one-rule module → none.
- **Local variant mixins** — parameterized mixin for color/variant matrices.
  `src/components/Button/Button.module.scss:132`
  - ✓ several selectors repeat a component-local declaration group.
  - ✗ reused across components → promote to a shared mixin.
- **Default modifiers via `@extend`** `[undocumented]` — default variant shares
  a full local declaration set. `src/components/Button/Button.module.scss:34`
  - ✓ a default variant intentionally shares another selector's complete set.
  - ✗ only a few overlapping declarations → mixin/explicit.
- **Low-specificity `:where()`** `[undocumented]` — keep state matching
  overridable. `src/components/Button/Button.module.scss:23`
  - ✓ variants/context styles should easily override state.
  - ✗ specificity intentionally needed to beat an external rule → scoped
    selector.
- **React Aria data-state styling** `[undocumented]` — `[data-pressed]`,
  `[disabled]`, custom flags. `src/components/Button/Button.module.scss:145`
  - ✓ visual state = a React Aria emitted attribute.
  - ✗ purely app/model state → your own class/data-attr.
- **Relational `:has()` selectors** `[undocumented]` — structural variants like
  icon-only. `src/components/Button/Button.module.scss:54`
  - ✓ styling genuinely depends on rendered composition.
  - ✗ the condition exists as state/props → apply a class.
- **Global `:global()` third-party** — target embedded third-party DOM under the
  root. `src/components/CodeEditor/CodeEditor.module.scss:35`
  - ✓ scoped styles must reach third-party widget classes.
  - ✗ Flow-owned elements → module classes/contextual styling.
- **Global `.flow--…` descendant selectors** `[undocumented]` — coordinate
  independently rendered descendants.
  `src/components/LayoutCard/LayoutCard.module.scss:16`
  - ✓ a layout must style standalone Flow classes unreachable via props/context.
  - ✗ normal composition → PropsContext classes.
- **Container-query ownership** `[undocumented]` — inline-size container at the
  semantic boundary. `src/components/Section/Section.module.scss:5`
  - ✓ descendants adapt to this component's available space.
  - ✗ viewport-wide adaptation → responsive primitives/media.
- **Logical CSS properties** `[undocumented]` — `padding-inline`,
  `margin-inline-start`. `src/components/Button/Button.module.scss:13`
  - ✓ direction-safe spacing/border/size.
  - ✗ a genuinely physical effect → physical properties.
- **`calc()` over tokens** `[undocumented]` — derive geometry from tokens (e.g.
  subtract border). `src/components/Button/Button.module.scss:26`
  - ✓ geometry derives mechanically from approved tokens.
  - ✗ invents a new visual constant → approved component token.

## 7. State / behavior

- **Overlay controller (`OverlayController` / `useOverlayController`)** —
  coordinated open/close.
  `src/lib/controller/overlay/useOverlayController.ts:10`
  - ✓ multiple participants coordinate imperative overlay behavior.
  - ✗ a single owner → ordinary controlled/uncontrolled state.
- **Controller prop for imperative coordination** `[undocumented]` — optional
  controller alongside declarative props. `src/components/Modal/Modal.tsx:43`
  - ✓ external actions must coordinate without lifting every event.
  - ✗ normal declarative ownership → controlled state props.
- **Controlled/uncontrolled state pairs** — preserve Aria
  `value`/`defaultValue`, `isOpen`/`isDefaultOpen`.
  `src/components/Modal/Modal.tsx:23`
  - ✓ consumers may own state or request an initial value.
  - ✗ cross-tree imperative orchestration → controller.
- **Callback compatibility adapters** `[undocumented]` — call both Flow + legacy
  callback during deprecation. `src/components/Select/Select.tsx:76`
  - ✓ Flow renames/combines upstream callbacks while keeping both contracts.
  - ✗ the upstream callback already matches → forward unchanged.
- **Object-ref conversion (`useObjectRef`)** — for stable/renamed refs.
  `src/components/Checkbox/Checkbox.tsx:36`
  - ✓ an Aria hook requires an object ref but the public API accepts React's
    form.
  - ✗ downstream accepts the original → pass through.
- **Behavior hooks beside complex components** `[undocumented]` —
  `<Component>/hooks/`. `src/components/Action/hooks/useActionState.ts:1`
  - ✓ cohesive reusable logic for one component domain.
  - ✗ generic cross-component behavior → `src/lib/hooks`.
- **Models for stateful domains** `[undocumented]` — `<Component>/models/`.
  `src/components/Action/models/ActionState.ts:1`
  - ✓ state with domain operations/invariants/lifecycle.
  - ✗ simple transient UI state → React state/hooks.
- **MobX for rich persistent models** `[undocumented]` — `makeAutoObservable`.
  `src/components/SettingsProvider/models/ComponentSettings.ts:14`
  - ✓ long-lived interconnected observable state.
  - ✗ ordinary component-local state → React primitives.
- **Settings context lookup (`useSettings`)** `[undocumented]` — optionally
  consume the nearest store.
  `src/components/SettingsProvider/SettingsProvider.tsx:19`
  - ✓ a component optionally consumes a settings store.
  - ✗ ordinary input → pass explicitly.
- **Pluggable settings backend** — constructed from props; localStorage default.
  `src/components/SettingsProvider/SettingsProvider.tsx:23`
  - ✓ persistence must work with localStorage + consumer strategies.
  - ✗ ephemeral session state → in-memory.
- **Serialized persistence writes** `[undocumented]` — promise-ref chained
  writes. `src/components/SettingsProvider/SettingsProvider.tsx:40`
  - ✓ async writes to the same record must preserve order.
  - ✗ independent idempotent writes → normal async.
- **Async resource loading** `[undocumented]` — Suspense-compatible, stable
  loader id. `src/components/SettingsProvider/SettingsProvider.tsx:25`
  - ✓ rendering must suspend until settings load + cache.
  - ✗ optional background data → local async state.
- **Read-only interaction guard** `[undocumented]` — `aria-disabled` +
  `data-readonly`, suppress handlers. `src/components/Button/Button.tsx:183`
  - ✓ keep an element discoverable/focusable while suppressing activation.
  - ✗ native disabling is correct → `disabled`.
- **Action-state live announcement** `[undocumented]` — pending/success/failure
  via aria-live. `src/components/Button/Button.tsx:130`
  - ✓ transitions need non-visual assistive feedback.
  - ✗ a static visual status already has an accessible name → avoid duplicate.

## 8. Forms / accessibility

- **Shared field wiring (`useFieldComponent`)** — field context, wrapper props,
  error infra. `src/components/Checkbox/Checkbox.tsx:34`
  - ✓ a form control joins label/description/validation/error composition.
  - ✗ a non-field interactive control → Aria primitive directly.
- **Generated error description id** — replaces `aria-describedby` while
  invalid. `src/lib/hooks/useFieldComponent.tsx:54`
  - ✓ an error message joins the control relationship.
  - ✗ no error description rendered → omit.
- **Field label context** — shared form styling + required/disabled semantics.
  `src/lib/hooks/useFieldComponent.tsx:38`
  - ✓ a composed label needs the control relationship + styling.
  - ✗ the primitive owns an inseparable native label → wire directly.
- **Field description context** — attaches description to the current field.
  `src/lib/hooks/useFieldComponent.tsx:44`
  - ✓ description children auto-attach to the field.
  - ✗ help text unrelated to a control → ordinary text.
- **Error capture boundary** `[undocumented]` — `FieldErrorCaptureContext` +
  `FieldErrorView`. `src/components/Checkbox/Checkbox.tsx:43`
  - ✓ nested `FieldError` content must associate with the control.
  - ✗ not compositional error children → the primitive's error API.
- **Semantic root first** — use the native/Aria element that provides the
  behavior. `src/components/Button/Button.tsx:179`
  - ✓ the interactive/landmark root.
  - ✗ styling-only structure → neutral layout primitives around the semantic
    root.
- **Generated label relationships** `[undocumented]` — `useId` +
  `aria-labelledby`, explicit `aria-label` wins.
  `src/components/Navigation/components/NavigationGroup/NavigationGroup.tsx:63`
  - ✓ separate generated label/content need stable linkage.
  - ✗ visible text already natively associated → no redundant ARIA.
- **Icon-only accessible names** — localized/caller `aria-label`.
  `src/components/Modal/Modal.tsx:87`
  - ✓ an interactive control has no visible textual name.
  - ✗ visible text already names it → decorative icon.
- **Decorative visual hiding (`aria-hidden`)** —
  icons/skeletons/separators/duplicated text.
  `src/components/Button/Button.tsx:143`
  - ✓ a visual duplicates text or carries no independent info.
  - ✗ unique meaning → give it an accessible label.
- **Presentation role for split decorative text** `[undocumented]` — mark
  fragmented visuals presentation. `src/components/Initials/Initials.tsx:38`
  - ✓ fragmented visual text would mislead AT while a complete label exists.
  - ✗ the rendered text is the intended name → normal semantics.
- **`disabled` vs `aria-disabled` distinction** `[undocumented]`.
  `src/components/Button/Button.tsx:29`
  - ✓ `aria-disabled` when discoverability/focus is intended + manual guard.
  - ✗ remove from interaction/focus → native `disabled`.
- **Render-prop state consumption** `[undocumented]` — consume Aria state via
  render props. `src/components/Checkbox/Checkbox.tsx:49`
  - ✓ Aria exposes interaction/validation state needed to render descendants.
  - ✗ state only affects CSS + has data-attrs → style those.

## 9. Internationalization

- **Colocated locale glob import** —
  `import locales from "./locales/*.locale.json"`.
  `src/components/Badge/Badge.tsx:16`
  - ✓ a component owns user-facing/a11y strings.
  - ✗ renders only consumer text → no locale bundle.
- **Namespaced formatter hook** —
  `useLocalizedStringFormatter(locales, "<Name>")`.
  `src/components/Badge/Badge.tsx:57`
  - ✓ reads its colocated messages under a stable namespace.
  - ✗ shared cross-component copy has an owner → that owner's formatter.
- **Both base languages** — matching `de-DE` + `en-US`.
  `src/components/Badge/locales/de-DE.locale.json:1`
  - ✓ any new/changed message in German and English.
  - ✗ — except a whole new language, which requires translating every locale
    dir.
- **Shared parent locale directory** `[undocumented]` — subcomponents import
  `../locales`.
  `src/components/FileCard/components/DeleteButton/DeleteButton.tsx:5`
  - ✓ a subcomponent's strings belong to the parent namespace.
  - ✗ independently public/reusable → own namespace.
- **Dotted message keys** `[undocumented]` — hierarchical keys, not deep
  nesting. `src/components/PasswordCreationField/locales/en-US.locale.json:9`
  - ✓ related messages need a readable namespace.
  - ✗ one simple message → flat key.
- **ICU interpolation and `select`** — conditional phrases/categories.
  `src/components/TextField/locales/en-US.locale.json:2`
  - ✓ grammar/copy varies by runtime values.
  - ✗ static message → plain text.
- **ICU `plural`** — count-based grammar.
  `src/components/PasswordCreationField/locales/en-US.locale.json:12`
  - ✓ wording changes with a count.
  - ✗ a number merely interpolated → simple interpolation.
- **Localized accessibility strings** — SR-only names from the formatter.
  `src/components/Badge/Badge.tsx:112`
  - ✓ library-authored labels reach assistive technology.
  - ✗ consumers provide the name → accept it as a prop.

## 10. Icons

- **Generated internal icon components** — import from
  `@/components/Icon/components/icons`. `src/components/Modal/Modal.tsx:14`
  - ✓ production components.
  - ✗ story-only glyph exploration → raw libs there.
- **Public icon re-export** — publish the generated set.
  `src/components/public.ts:54`
  - ✓ an intentionally supported icon.
  - ✗ an internal glyph → keep out.
- **Icon wrapper contract (`IconProps`)** — spinners/alert icons reuse it.
  `src/components/LoadingSpinner/LoadingSpinner.tsx:4`
  - ✓ a custom visual icon honoring size/color/a11y.
  - ✗ not an icon / can't honor it → a semantic component.
- **Contextual icon sizing** — set child icon size via `PropsContext`.
  `src/components/Button/Button.tsx:141`
  - ✓ icons in a composition inherit parent size.
  - ✗ an informative standalone icon → set locally.
- **Automatic decorative default** — `Icon` self-hides without `aria-label`.
  `src/components/Icon/Icon.tsx:36`
  - ✓ an unlabeled icon is decoration.
  - ✗ conveys unique info → label it.
- **Explicitly labeled informative icon** — `aria-label` when the icon carries
  info.
  - ✓ the icon alone communicates status/action.
  - ✗ it duplicates visible text → decorative.
- **State-specific icon selection** `[undocumented]` — pick the icon before JSX,
  single render site. `src/components/Button/Button.tsx:160`
  - ✓ distinct pending/success/failure glyphs.
  - ✗ no icon requirement / a stable icon stays accurate → avoid switching.
- **Raw icon libraries in icon stories only** `[undocumented]`.
  `src/components/Icon/stories/Default.stories.tsx:3`
  - ✓ icon stories demoing the `Icon` wrapper.
  - ✗ production → generated internal icons.

## 11. Testing and stories

- **Default story file** — `stories/Default.stories.tsx`.
  `src/components/Button/stories/Default.stories.tsx:1`
  - ✓ every component.
  - ✗ — except non-component utilities and generated code.
- **Typed Storybook metadata** — `const meta: Meta<typeof Component>`.
  `src/components/Button/stories/Default.stories.tsx:15`
  - ✓ validate metadata/args against the contract.
  - ✗ — except non-Storybook fixtures.
- **Documentation category title** — e.g. `Actions/Button`.
  `src/components/Button/stories/Default.stories.tsx:16`
  - ✓ matches the docs taxonomy.
  - ✗ internal fixture stories → appropriate internal grouping.
- **Action handlers in args** — `action("callbackName")`.
  `src/components/Button/stories/Default.stories.tsx:19`
  - ✓ callbacks observable in interactions.
  - ✗ a callback drives essential story state → render/play logic.
- **Explicit enum controls** `[undocumented]` — inline-radio/select options.
  `src/components/Button/stories/Default.stories.tsx:29`
  - ✓ a finite prop vocabulary.
  - ✗ boolean/numeric/free-form → natural control.
- **Typed story alias** — `type Story = StoryObj<typeof Component>`.
  `src/components/Button/stories/Default.stories.tsx:70`
  - ✓ repeated story declarations.
  - ✗ no exported stories → none.
- **Empty canonical default story** `[undocumented]` —
  `export const Default: Story = {}`.
  `src/components/Button/stories/Default.stories.tsx:71`
  - ✓ metadata args/render express the default.
  - ✗ the default needs unique setup → add only that setup.
- **Variant stories by meaningful composition** —
  icons/states/content/responsive/edge cases.
  `src/components/Button/stories/Default.stories.tsx:73`
  - ✓ a distinct supported use case.
  - ✗ permuting every prop combination → controls.
- **Per-story `render` override** `[undocumented]`.
  `src/components/Button/stories/Default.stories.tsx:74`
  - ✓ one scenario needs different structure/state.
  - ✗ all stories share structure → render in metadata.
- **Story environment helper** `[undocumented]` — `StoryBackground`,
  `dummyText`. `src/components/Button/stories/Default.stories.tsx:61`
  - ✓ needs stable layout/dimensions/background/providers.
  - ✗ renders fine in the default canvas → no scaffold.
- **Story fixture module** — bulky reusable fixtures in `stories/lib.tsx`.
  - ✓ multiple stories share realistic story-only data/components.
  - ✗ production/test logic → source/test helper.
- **Browser test colocated** — `<Name>.browser.test.tsx`.
  `src/components/TextField/TextField.browser.test.tsx:5`
  - ✓ observable interaction/async/controller/form/controlled behavior.
  - ✗ pure transformations → unit tests.
- **Browser rendering API** — `vitest-browser-react` + `userEvent`.
  `src/components/TextField/TextField.browser.test.tsx:6`
  - ✓ needs real React rendering + DOM interaction.
  - ✗ pure logic → call directly.
- **Role-first queries** — `getByRole` + accessible names.
  `src/components/TextField/TextField.browser.test.tsx:7`
  - ✓ an accessible role/name identifies the element.
  - ✗ none exists → fix a11y first, then the narrowest fallback.
- **User-observable assertions** — displayed values/focus/state/effects.
  `src/components/TextField/TextField.browser.test.tsx:9`
  - ✓ assert what users can observe.
  - ✗ implementation details → don't couple tests to them.
- **Pure unit test colocation** — `*.test.ts` beside `lib/` helpers.
  `src/components/Initials/lib/getInitialsFromString.test.ts:4`
  - ✓ a pure helper.
  - ✗ DOM behavior → a browser test.
- **Table-driven unit cases** `[undocumented]` — `test.each`.
  `src/components/Initials/lib/getInitialsFromString.test.ts:9`
  - ✓ many inputs exercise the same rule/assertion shape.
  - ✗ cases need different setup → named tests.
- **Compile-time contract tests** — `*.test-types.tsx`.
  `src/components/CartesianChart/typedCartesianChart.test-types.tsx:15`
  - ✓ generic/sophisticated public typing.
  - ✗ straightforward non-generic props → ordinary typechecking.
- **Positive type assertions (`expectTypeOf`)**.
  `src/components/CartesianChart/typedCartesianChart.test-types.tsx:41`
  - ✓ supported inference/assignments are contract.
  - ✗ runtime semantics → runtime test.
- **Negative type assertions (`@ts-expect-error`)**.
  `src/components/CartesianChart/typedCartesianChart.test-types.tsx:27`
  - ✓ specific invalid usages must fail compilation.
  - ✗ runtime validation → runtime test.
- **Visual snapshots beside browser tests** `[undocumented]` —
  `__screenshots__/`.
  - ✓ visual regressions materially matter and it renders in browser tests.
  - ✗ pure logic / intentionally unstable visuals → behavioral assertions.

## 12. Imports and file conventions

- **Absolute alias for package code** — `@/components|lib|styles|views`.
  `src/components/Button/Button.tsx:10`
  - ✓ imports cross component/library boundaries.
  - ✗ colocated within the same anatomy → relative.
- **Relative imports for colocated files** — own stylesheet/locales/local
  helpers. `src/components/Button/Button.tsx:2`
  - ✓ own stylesheet/locales/nearby module.
  - ✗ reaches another package area/component → alias.
- **Separate type-only import (`import type`)**.
  `src/components/Button/Button.tsx:1`
  - ✓ a type-only statement.
  - ✗ types + values from the same module → inline `type`.
- **Inline `type` specifier in mixed imports** `[undocumented]`.
  `src/components/Modal/Modal.tsx:5`
  - ✓ one module supplies values + types.
  - ✗ type-only → `import type`.
- **Namespace React Aria import (`import * as Aria`)** `[undocumented]`.
  `src/components/Button/Button.tsx:3`
  - ✓ several Aria names / collision avoidance.
  - ✗ one unambiguous symbol → direct import.
- **PascalCase component directories/files** —
  `src/components/<Name>/<Name>.tsx`.
  - ✓ public/anatomical React components.
  - ✗ hooks/helpers/models/styles/tests → role-specific naming.
- **One principal component per file** — the registered component in its
  same-named file.
  - ✓ one exported API owner (tiny private helpers OK local).
  - ✗ multiple independently reusable → split.
- **Subcomponents mirror component anatomy** `[undocumented]`.
  `src/components/Table/components/TableHeader/index.ts:1`
  - ✓ a reusable subcomponent with its own artifacts.
  - ✗ a single-file detail → keep under `components/`
    (`src/components/DonutChart/components/DonutChartFill.tsx:1`).
- **Behavior folders by role** `[undocumented]` — `components/`, `hooks/`,
  `lib/`, `models/`, `locales/`, `stories/`.
  - ✓ complex component-local code separates concerns.
  - ✗ one/two simple helpers → colocate, no empty taxonomy.
- **Index as API boundary** — `index.ts` defines the export surface only.
  `src/components/Button/index.ts:3`
  - ✓ external callers import the supported surface.
  - ✗ impl files in the same anatomy → direct relative imports OK.
- **No generated-file edits** — `view.ts`/`src/views`/generated icons/`dist`.
  - ✓ change via source/generator.
  - ✗ — except the handwritten generator inputs themselves.

## 13. Miscellaneous composition and runtime

- **Mutable package feature flags** — exported `flags` object + test reset.
  `src/flags.ts:1`
  - ✓ temporary package-wide switches changed at runtime/tests.
  - ✗ integration-specific → the integration's flag.
- **Integration-local flags** `[undocumented]`.
  `src/integrations/react-hook-form/flags.ts:1`
  - ✓ a switch affecting one optional integration.
  - ✗ core behavior → the package-level flag.
- **Browser-only mount guard (`useIsMounted`)** — render browser-dependent
  children after mount. `src/components/BrowserOnly/BrowserOnly.tsx:6`
  - ✓ children need a mounted browser (no SSR access).
  - ✗ SSR-safe content → render directly.
- **Intentional `SuspenseTrigger`** — never-resolving promise activates a
  fallback. `src/components/SuspenseTrigger/SuspenseTrigger.tsx:7`
  - ✓ deliberately suspend for boundary testing/orchestration.
  - ✗ ordinary async → resource/state loading patterns.
- **Local `Suspense` boundaries for async content** `[undocumented]`.
  `src/components/Modal/Modal.tsx:182`
  - ✓ independently suspending content + a component-specific fallback.
  - ✗ the app coordinates the whole load → let suspension bubble.
- **Text wrapping for string children** `[undocumented]` — detect raw strings,
  wrap in `Text`. `src/components/Button/Button.tsx:176`
  - ✓ typography is context-driven and children may be raw strings (local +
    remote).
  - ✗ already-structured nodes → preserve them.
- **Layout primitives over ad-hoc wrappers** `[undocumented]` — `Section`,
  `ColumnLayout`, `Align`, `Flex`, `Content`.
  - ✓ spacing/align/columns/stack expressible via Flow primitives.
  - ✗ a wrapper needed for semantics/third-party/owned styling → the correct
    semantic element.
- **Context-driven heading hierarchy** `[undocumented]`.
  `src/components/Modal/Modal.tsx:103`
  - ✓ a composition knows the levels for nested headings/sections.
  - ✗ a single fixed heading → set its level explicitly.
- **Semantic generated ids (`useId`)** `[undocumented]`.
  `src/components/Modal/Modal.tsx:78`
  - ✓ local label/title/content relationships need stable collision-safe ids.
  - ✗ consumers provide the id / no relationship → preserve/omit.
- **Loading/success/failure as explicit visual states** `[undocumented]`.
  `src/components/Button/Button.tsx:160`
  - ✓ an async action has meaningful pending/terminal feedback.
  - ✗ a synchronous action with no observable lifecycle → normal content.
- **Status vocabulary reuse (`PropsWithStatus`)** `[undocumented]` —
  `info|success|warning|danger|unavailable`. `src/lib/types/props.ts:4`
  - ✓ expresses an existing cross-component status concept.
  - ✗ a genuinely component-specific state → define locally.
- **Semantic alpha-color vocabulary (`AlphaColor`)** `[undocumented]`.
  `src/lib/types/props.ts:44`
  - ✓ public color props use the established semantic palette.
  - ✗ a UX-defined specialized palette → component-specific vocabulary.
- **`Render` helper for conditional values** `[undocumented]`.
  `src/components/public.ts:111`
  - ✓ a declarative child renders a value/function gated by a condition.
  - ✗ inline boolean/ternary JSX is already clear → native JSX.

---

## Notable undocumented conventions

The highest-value conventions a newcomer would otherwise miss:

- **`PropsContext` is structural, not just styling** — nested entries, `dynamic`
  children, semantic defaults, and contextual `wrapWith` define much of a
  composite's internal API.
- **The factory supplies hidden infrastructure** — memoization, nested-context
  preservation, slot propagation, UI isolation, and tunnel entry/provider wiring
  are automatic consequences of `flowComponent`.
- **Raw strings get `Text`-normalized** where typography is context-driven;
  explicit structured content is left intact.
- **Semantic generated CSS classes are cross-component coordination points** —
  scoped modules still use `:global(.flow--…)` when independently rendered Flow
  descendants must affect layout.
- **Controllers coexist with declarative props** — overlay-like APIs support
  controlled/uncontrolled props _and_ a controller object.
- **Complex behavior is split by vocabulary** — `components/` render, `hooks/`
  behavior, `lib/` pure transforms, `models/` durable state.
- **`SettingsProvider` combines async resources, hierarchical MobX stores, and
  serialized, Suspense-aware writes.**
- **Story metadata is the canonical default scenario** — the common `Default`
  story is deliberately empty.
- **CSS leans on modern relational/low-specificity selectors** — `:has`,
  `:where`, logical properties, data attributes, and container boundaries reduce
  runtime styling props.
- **Universal exports are deliberately explicit** — remote-safe values and their
  types are curated independently of the ordinary public surface.

---

## Decision cheat-sheet

Quick answers to the highest-frequency choices when authoring a component:

- **Normal public leaf** → `flowComponent` + UI classification, not a plain FC.
- **Arranges descendants** → `layout`; **establishes infra/context** →
  `provider`.
- **Props with owned fields** → `interface`; **props that transform/intersect**
  → `type` alias.
- **Internal & single-use** → local `Props`, plain file; no registry/barrel
  prematurely.
- **Descendants need overridable defaults** → PropsContext — but only if every
  target is remote-capable.
- **Universal code composing a Flow component** → view import (`@/views/*`);
  direct import only in host-only code.
- **Consumers own state** → controlled/uncontrolled pairs; **cross-tree
  imperative coordination** → a controller.
- **Behavior specific to a component** → hook/model/helper beside it; only
  cross-component utilities go to `src/lib`.
- **Subcomponent with its own reusable API/artifacts** → directory + barrel;
  otherwise one colocated file.
- **Structure that's only spacing/alignment** → Flow layout primitives; a raw
  wrapper only for semantics or component-owned integration.
