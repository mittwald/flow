# SkeletonMode — skeleton UIs derived from the real UI

Status: design approved, not implemented · 2026-09-29

## Problem

Every loading view in Flow is a second, hand-built tree next to the real one:

```tsx
// loading
<Heading><SkeletonText width="12em" /></Heading>
// loaded
<Heading>{domain.hostname}</Heading>
```

`Skeleton` (block, `width`/`height`) and `SkeletonText` (inline bar, `1em` high)
are the only primitives. Widths are guessed, the two trees drift apart, and
consumers and extension developers repeat this for every card, list item and
form. Examples: `ListItemSkeletonView.tsx`, the docs example
`list/list/examples/loadingView.tsx`.

## Scope

This spec covers part **A**: a skeleton mode for the real components. Two
follow-ups get their own specs:

- **B:** ready-made patterns, and moving the `List`/`Table` loading views onto
  `SkeletonMode`.
- **C:** Suspense fallbacks, which become "the real UI inside `SkeletonMode`" as
  the `fallback`.

It must work remotely (mStudio extensions). Otherwise extension developers keep
the parallel tree.

## Prior art

React Spectrum 2 is the only kit that derives skeletons from the real UI through
context (`<Skeleton isLoading>`, `useIsSkeleton()`). Its text rendering is the
one adopted here. Every other kit builds a parallel tree: MUI, Chakra v3, Ant
Design, Carbon (about 37 `*Skeleton` components), Polaris, Fluent v9. Radix and
Mantine only wrap single elements. Details that changed this design:

- **S2 puts `inert` on the whole `Card` root**, which blocks any nested opt-out.
  Here only leaves get `inert`.
- **S2 resets the skeleton context below a skeleton surface** (Button, Badge),
  so inner text draws no second bar. Adopted.
- **S2 forces `isDisabled` on form fields** instead of shimmering them. Not
  adopted, see [Decision: form fields shimmer](#decision-form-fields-shimmer).
- **Polaris announces loading once** with `role="status"` and an i18n label. No
  other kit announces anything. Adopted.
- **Carbon handles `forced-colors`.** Adopted.
- **Radix lets components keep their shape** through CSS variables
  (`--skeleton-radius-override`). Adopted.

Sources:
[S2 Skeleton.tsx](https://github.com/adobe/react-spectrum/blob/main/packages/@react-spectrum/s2/src/Skeleton.tsx),
[S2 Card.tsx](https://github.com/adobe/react-spectrum/blob/main/packages/@react-spectrum/s2/src/Card.tsx),
[S2 Form.tsx](https://github.com/adobe/react-spectrum/blob/main/packages/@react-spectrum/s2/src/Form.tsx),
[Polaris SkeletonPage](https://github.com/Shopify/polaris/blob/main/polaris-react/src/components/SkeletonPage/SkeletonPage.tsx),
[Carbon \_skeleton.scss](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/utilities/_skeleton.scss),
[Radix skeleton.css](https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/components/skeleton.css).

## Public API

```tsx
<SkeletonMode isEnabled={isLoading}>
  <LayoutCard>
    <Heading>example-domain.de</Heading> {/* bar in content width */}
    <Text /> {/* bar in default width */}
    <TextField label="Name" /> {/* label bar + field surface */}
    <Button>Speichern</Button> {/* surface in button size */}
  </LayoutCard>
</SkeletonMode>
```

- One new component, `SkeletonMode`: `@flr-generate all`, a provider type. Not
  in `flr-universal` (the two are either-or).
- One prop, `isEnabled?: boolean`, default `true`. The same tree renders as
  skeleton or as real UI, so it replaces a second tree and serves as a Suspense
  `fallback` (part C).
- Nesting opts out: `<SkeletonMode isEnabled={false}>` inside an enabled mode
  renders its subtree as real UI, e.g. a static section title while data loads.
- **Widths come from content.** Text with content keeps its width. Text without
  content gets a default width for its component. There is no `skeletonWidth`
  prop on the components: placeholder content does the same job without adding
  API to about 30 components.
- `Skeleton` and `SkeletonText` stay public and unchanged in API. Internally
  they are the building blocks.
- `useSkeletonMode()` is internal and not exported.

## Rendering rules

**Base rule (everything that isn't plain text): the shape stays, the content
disappears.** The component renders its real markup, with these changes:

- Children get `visibility: hidden`.
- Text gets `-webkit-text-fill-color: transparent`.
- The surface gets the skeleton background and shimmer.

Size, spacing and radius therefore stay exact without measuring. Components set
CSS variables (`--skeleton-radius`, and others if needed) to keep their own
shape, e.g. round for a `Switch`, `Avatar` or `RadioButton`.

**Text rule:**

- **With content:** the content is wrapped in an inline element with a
  transparent text fill, a bar background and `box-decoration-break: clone`.
  This gives one bar per line in the real width. The fill hides the ellipsis of
  truncated text too.
- **Without content:** the component renders `SkeletonText` in its default
  width, e.g. `Heading` 12em, `Text` 8em, `Label` 6em. Final values are set
  during implementation.
- Font size and line height stay, so a `Heading` bar is taller than a `Text`
  bar.

**Context reset:** a component that renders as a surface resets the mode for its
children. The `Text` inside a `Button` or `Badge` then draws no second bar on
top of the shimmer.

| Group         | Components                                                                                                                                                                                                                                                                           | Rendering                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text          | `Heading`, `Text`, `Label`, `Link`, `InlineCode`, `AlertText`, `BigNumber`, `LabeledValue`                                                                                                                                                                                           | Text rule.                                                                                                                                                                                          |
| Visual        | `Avatar`, `Icon`, `Image`, `Initials`, `Badge`, `CounterBadge`, `AlertBadge`                                                                                                                                                                                                         | Base rule. In the mode, `Image` issues no request: it renders a surface sized by its `width`/`height` props, or 16:9 without them.                                                                  |
| Interactive   | `Button`, `CopyButton`, `Link` styled as a button, `ContextMenu` trigger                                                                                                                                                                                                             | Base rule.                                                                                                                                                                                          |
| Form fields   | `TextField`, `TextArea`, `NumberField`, `SearchField`, `PasswordCreationField`, `Select`, `ComboBox`, `Autocomplete`, `DatePicker`, `DateRangePicker`, `TimeField`, `FileField`, `Slider`, `SegmentedControl`, `Checkbox`, `CheckboxGroup`, `CheckboxButton`, `RadioGroup`, `Switch` | The label and `FieldDescription` follow the text rule. The input or control follows the base rule. `FieldError` is not rendered.                                                                    |
| Navigation    | `Navigation`, `HeaderNavigation`, `TabNavigation`, `Breadcrumb`, the `Tabs` tab list                                                                                                                                                                                                 | The structure stays. Labels follow the text rule and icons the base rule. The active indicator (underline, background) is hidden, so no false state shows.                                          |
| Status        | `Alert`, `AlertIcon`, `Message`, `MessageThread`, `IllustratedMessage`, `Notification`, `Activity`, `Rating`, `Legend`, `ProgressBar`, `LoadingSpinner`                                                                                                                              | The container stays and the content follows its rules. Status colors on surfaces turn neutral. `ProgressBar` shows the track as a surface without a fill. `LoadingSpinner` becomes a round surface. |
| Content       | `Kbd`, `AvatarStack`, `FileCard`, `FileCardList`, `FileDropZone`, `CodeBlock`, `Markdown`, `Chat`                                                                                                                                                                                    | `Kbd`, `FileDropZone` and `CodeBlock` follow the base rule. Composites (`AvatarStack`, `FileCard`, `Markdown`) follow the rules of their parts.                                                     |
| Charts/editor | `CartesianChart`, `DonutChart`, `CodeEditor`, `MarkdownEditor`, `ImageCropper`, `Calendar`, `RangeCalendar`                                                                                                                                                                          | One surface in component size. Charts render no SVG, and editors don't load their engine.                                                                                                           |
| Lists/tables  | `List`, `Table`                                                                                                                                                                                                                                                                      | Rendered items and cells follow the rules of their content. The own loading views stay; part B decides whether they move onto `SkeletonMode`.                                                       |
| Overlays      | `Modal`, `Popover`, `Tooltip`, `LightBox`, `CoachMark`, `ContextualHelp`, `ContextMenu`                                                                                                                                                                                              | Triggers follow their group's rule and cannot open anything (`inert`). A controlled open overlay is in the mode too, because React context passes through portals.                                  |
| Containers    | `Section`, `LayoutCard`, `ColumnLayout`, `Align`, `Flex`, `Header`, `Content`, `AccentBox`, `Separator`, `Accordion`, `Tabs`, `ActionGroup`                                                                                                                                          | Render unchanged and pass the mode on. Never `inert`.                                                                                                                                               |
| Non-visual    | Providers (`IntlProvider`, `RouterProvider`, `TranslationProvider`, …), `Action`, `Render`, `Wrap`, `Div`, `Combine`, `Truncate`, `SuspenseTrigger`, `TunnelEntry`, `BrowserOnly`, `OverlayTrigger`                                                                                  | Unchanged.                                                                                                                                                                                          |

## Accessibility and interaction

- **`inert` on leaf roots only**: text, icon, button, field and every other
  component that renders a bar or a surface. A descendant cannot undo `inert`,
  so it never goes on a container, where it would block the nested
  `isEnabled={false}`. `inert` also hides the leaf from assistive technology and
  blocks focus, pointer input and overlay triggers.
- **Announcement:** the outermost enabled `SkeletonMode` renders a visually
  hidden `role="status"` text once: "Inhalt wird geladen" / "Loading content"
  (`de-DE` and `en-US`). There is no `aria-busy`: `SkeletonMode` renders no
  layout element, so flex and grid layouts don't break, and `aria-busy` would
  need one.
- **Reduced motion:** `globals.scss` already stops every animation under
  `prefers-reduced-motion: reduce`. The shimmer ends with the highlight outside
  the surface, so only the background stays.
- **`forced-colors`:** bars and surfaces in the system color `GrayText`, without
  shimmer.
- **Focus on toggle:** if focus sits in a component while `isEnabled` switches
  to `true`, the focus falls back to `body`. Accepted and documented. Switching
  back to the real UI has no focus effect.
- **Forms:** fields keep their real, `inert` `input`. Submitting during loading
  sends empty values. This edge case is documented and not handled.
- **Shimmer phase:** shimmers are not synchronised across elements. S2 does this
  with WAAPI. The CSS route (`background-attachment: fixed`) fails on iOS. YAGNI
  until someone notices.

## Remote

- `SkeletonMode` is `@flr-generate` and has the provider type. The host renders
  it as a real context provider, and the host-side Flow components read the
  context as they do locally. The protocol does not change.
- **Older hosts** don't know `flr-skeleton-mode`. PR 1 verifies that an old host
  renders the children normally (a complete UI without skeleton is acceptable).
  If it doesn't, gate the behaviour through the cross-version tests
  (`run-cross-version-tests` label).

## Styling and code layout

- **No component tokens.** The skeleton color `rgba(183, 201, 219, 0.5)` is in
  no palette, and no component token carries a raw color. The value lives once
  in `src/styles/mixins/skeleton.scss`. A token follows once UX picks a palette
  color.
- **`src/styles/mixins/skeleton.scss`** holds the mixins `surface` (base rule),
  `text` (text rule) and `keyframes`. `Skeleton` and `SkeletonText` use
  `surface` with no visual change. Components set `--skeleton-radius` to keep
  their shape.
- **`src/components/SkeletonMode/`** holds:
  - the component, with `view.ts` generated;
  - `skeletonModeContext.tsx`: the context, `useSkeletonMode()` and
    `SkeletonModeReset` for surfaces;
  - `components/SkeletonTextContent`: the text rule for a text component's
    children;
  - `components/SkeletonRawText`: the text rule for raw text in containers
    (`Content`), locally strings and numbers, remotely `RemoteTextRenderer`
    elements;
  - `lib/`: `hasContent`, `isTextChild`.
- A text component renders `inert` on its root and wraps its children in
  `SkeletonTextContent`. `Link` renders a `span` instead of its anchor in the
  mode, because react-aria's `Link` drops `inert`, and a skeleton needs no
  anchor.
- `SkeletonMode` carries `@flowStatus beta, new` until PR 5 completes the
  coverage.

## Testing

- **Unit** (`SkeletonMode/lib`): `hasContent` for local and remote text.
- **Browser** (`SkeletonMode.browser.test.tsx`):
  - `inert` sits on leaves, not on containers.
  - A nested `isEnabled={false}` subtree stays focusable and operable.
  - `role="status"` renders exactly once.
  - `Image` issues no request, charts render no SVG, editors don't load their
    engine.
  - A `Text` inside a `Button` draws no bar.
- **Visual**
  (`remote-react-components/src/tests/visual/SkeletonMode<Group>.browser.test.tsx`):
  one file per group, so the PRs don't conflict. Each runs `Local` and `Remote`,
  WebKit in light and Firefox in dark theme. Every PR adds the file for its
  group and gets the `run-visual-tests` label. `forced-colors` has no test:
  vitest's browser mode cannot emulate it.
- **Cross-version:** PR 1 runs with `run-cross-version-tests`.

## Docs and Definition of Done

- A docs page `apps/docs/src/content/components/content/skeleton-mode/` (German)
  with examples per group, and notes on focus loss and forms. The `Skeleton` and
  `SkeletonText` pages point to `SkeletonMode` as the preferred way.
- A story `SkeletonMode/stories/Default.stories.tsx` with an `isEnabled` toggle.
- A demo page in `apps/remote-dom-demo`.
- Locales in `de-DE` and `en-US`. Exported from `public.ts`. Generated code
  committed.
- The change is additive, so there is no migration entry. It ships as `feat`
  against `next`.

## Delivery

One spec, five PRs, each with its own tests, visual scenarios and docs:

1. **Foundation + text:**
   - `SkeletonMode`, the context and hook, and the mixins.
   - `Skeleton`/`SkeletonText` moved onto the mixin, plus `forced-colors`.
   - The text group, the docs page, the story, the demo, and the cross-version
     check.
2. **Visual + interactive**, including the context reset.
3. **Form fields.**
4. **Navigation + status.**
5. **Content, charts/editors, overlays, list/table items.**

## Decision: form fields shimmer

S2 forces `isDisabled` on fields in skeleton mode. Fields then stay visible and
assistive technology announces them as dimmed. Flow shimmers them and adds
`inert` instead:

- It matches every other group.
- It keeps loading placeholders out of the accessibility tree.
- A disabled form would claim a state the data doesn't have yet.
