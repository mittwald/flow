# Modal Mobile Virtual-Keyboard Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix issue #2423 — on mobile, a Modal with a form is cramped because the fixed header/footer squeeze the content when the virtual keyboard opens. Make the mobile Modal a single scroll container with a sticky header + sticky footer at rest that both un-stick (flow normally) while the keyboard is open, so the content gets maximum room and the footer stays reachable.

**Architecture:** The mobile Modal (`@media (max-width: 768px)`, non-off-canvas) becomes one scroll container: the dialog scrolls, header is `position: sticky; top: 0`, footer is `position: sticky; bottom: 0`, and the three regions use `flex: 0 0 auto` so the flex column never compresses the content box. A new `useVirtualKeyboardVisible` hook detects the on-screen keyboard via the VisualViewport API (`window.innerHeight - visualViewport.height > threshold`); while it is open the Modal adds a `keyboardVisible` class that switches header + footer to `position: static`, so everything flows and the content uses the full space. Desktop and off-canvas are untouched. Builds on the existing react-aria `--visual-viewport-height` placement (PR #2332) — no history revert.

**Tech Stack:** React 19 (ref-as-prop, no forwardRef), react-aria-components, SCSS modules + design-token CSS variables, Vitest (unit + Playwright-backed browser mode), Storybook.

**Validation status:** This layout was prototyped as spike "variant D" and **confirmed working on a real iOS simulator**. This plan turns the throwaway spike into the default behavior. See `packages/components/src/components/Modal/stories/SPIKE-2423-NOTES.md` (deleted in Task 5).

## Global Constraints

- Node `>=20.19`; pnpm via corepack. Run single-package scripts as `corepack pnpm --filter @mittwald/flow-react-components <script>`; dependency-graph targets as bare `pnpm nx <target> components`.
- **No base design-token changes.** Reuse existing component tokens (`--modal--background-color`, `--modal--footer-background-color`, `--modal--corner-radius`, `--visual-viewport-height`). Do not invent tokens.
- **No new public props on Modal** → no `@flr-generate` regeneration and no `doc-properties` change. Modal is not `@flr-generate`; keep it that way.
- **Conventional Commits**, scoped, in English: `fix(Modal): …`, `test(Modal): …`, `feat(core): …`.
- Never hand-edit generated files.
- **Visual snapshots are Linux-gated:** local macOS only regenerates `-darwin` baselines; the committed CI baseline is `-webkit-linux`. Do not commit local `-darwin` churn as the fix; use the `update-screenshots` PR label to regenerate the Linux baseline, and the `run-visual-tests` label to verify.
- Only remote-capable components belong in a `PropsContext` — do not add non-remote components to Modal's context.

---

### Task 1: `useVirtualKeyboardVisible` hook + pure predicate

Detect the on-screen keyboard from the VisualViewport API, with the threshold comparison extracted as a pure, unit-tested function.

**Files:**
- Create: `packages/components/src/lib/hooks/dom/useVirtualKeyboardVisible.ts`
- Test: `packages/components/src/lib/hooks/dom/useVirtualKeyboardVisible.test.ts`

**Interfaces:**
- Produces:
  - `isVirtualKeyboardVisible(layoutViewportHeight: number, visualViewportHeight: number, threshold?: number): boolean`
  - `useVirtualKeyboardVisible(): boolean`
  - `VIRTUAL_KEYBOARD_MIN_HEIGHT: number` (= 150)

- [ ] **Step 1: Write the failing unit test**

Create `packages/components/src/lib/hooks/dom/useVirtualKeyboardVisible.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import {
  isVirtualKeyboardVisible,
  VIRTUAL_KEYBOARD_MIN_HEIGHT,
} from "./useVirtualKeyboardVisible";

describe("isVirtualKeyboardVisible", () => {
  test("false when the visual viewport equals the layout viewport", () => {
    expect(isVirtualKeyboardVisible(800, 800)).toBe(false);
  });

  test("false for a small shrink (browser chrome, not the keyboard)", () => {
    expect(isVirtualKeyboardVisible(800, 700)).toBe(false);
  });

  test("true when the shrink exceeds the threshold (keyboard open)", () => {
    expect(isVirtualKeyboardVisible(800, 500)).toBe(true);
  });

  test("threshold boundary is exclusive", () => {
    expect(
      isVirtualKeyboardVisible(800, 800 - VIRTUAL_KEYBOARD_MIN_HEIGHT),
    ).toBe(false);
    expect(
      isVirtualKeyboardVisible(800, 800 - VIRTUAL_KEYBOARD_MIN_HEIGHT - 1),
    ).toBe(true);
  });

  test("respects a custom threshold", () => {
    expect(isVirtualKeyboardVisible(800, 700, 50)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `corepack pnpm --filter @mittwald/flow-react-components exec vitest run --project=unit src/lib/hooks/dom/useVirtualKeyboardVisible.test.ts`
Expected: FAIL — cannot resolve `./useVirtualKeyboardVisible`.

- [ ] **Step 3: Implement the hook + predicate**

Create `packages/components/src/lib/hooks/dom/useVirtualKeyboardVisible.ts`:

```ts
import { useEffect, useState } from "react";

/**
 * Minimum shrinkage (px) of the visual viewport relative to the layout viewport
 * that we treat as "the on-screen keyboard is open". Filters out the much
 * smaller changes caused by mobile browser chrome (e.g. the address bar).
 */
export const VIRTUAL_KEYBOARD_MIN_HEIGHT = 150;

/**
 * Pure predicate: the visual viewport is at least `threshold` px shorter than
 * the layout viewport (i.e. the on-screen keyboard is open).
 */
export const isVirtualKeyboardVisible = (
  layoutViewportHeight: number,
  visualViewportHeight: number,
  threshold: number = VIRTUAL_KEYBOARD_MIN_HEIGHT,
): boolean => layoutViewportHeight - visualViewportHeight > threshold;

/**
 * Tracks whether the on-screen (virtual) keyboard is currently open, using the
 * VisualViewport API. On iOS and Android the layout viewport stays while the
 * visual viewport shrinks by the keyboard height. Returns `false` where
 * VisualViewport is unavailable (SSR, very old browsers).
 */
export const useVirtualKeyboardVisible = (): boolean => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }
    const update = (): void => {
      setVisible(isVirtualKeyboardVisible(window.innerHeight, viewport.height));
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return visible;
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `corepack pnpm --filter @mittwald/flow-react-components exec vitest run --project=unit src/lib/hooks/dom/useVirtualKeyboardVisible.test.ts`
Expected: PASS (6 assertions).

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/lib/hooks/dom/useVirtualKeyboardVisible.ts packages/components/src/lib/hooks/dom/useVirtualKeyboardVisible.test.ts
git commit -m "feat(components): add useVirtualKeyboardVisible hook"
```

---

### Task 2: Replace spike scaffolding in `Modal.tsx` with the hook

Remove the throwaway `spikeVariant`/`spikeKeyboard` props and their effects; wire the real hook to toggle a `keyboardVisible` class.

**Files:**
- Modify: `packages/components/src/components/Modal/Modal.tsx`

**Interfaces:**
- Consumes: `useVirtualKeyboardVisible()` from Task 1 (`@/lib/hooks/dom/useVirtualKeyboardVisible`).
- Produces: the Modal root element gets the CSS-module class `styles.keyboardVisible` while the keyboard is open (Task 3 CSS relies on the compiled `.flow--modal--keyboard-visible`).

- [ ] **Step 1: Restore the `react` import to the production set**

In `packages/components/src/components/Modal/Modal.tsx`, replace the multi-line spike import block with:

```tsx
import { type PropsWithChildren, type ReactNode, Suspense, useId } from "react";
```

(Removes `useEffect`/`useState` — no longer needed once the spike effects are gone.)

- [ ] **Step 2: Add the hook import**

Add near the other `@/lib` imports:

```tsx
import { useVirtualKeyboardVisible } from "@/lib/hooks/dom/useVirtualKeyboardVisible";
```

- [ ] **Step 3: Remove the spike props from `ModalProps`**

Delete the `spikeVariant` and `spikeKeyboard` JSDoc + fields so the interface ends at:

```tsx
  /** Whether the close button should be visible */
  showCloseButton?: boolean;
}
```

- [ ] **Step 4: Remove spike destructuring + effects; call the hook**

In the component body, the destructuring must not pull `spikeVariant`/`spikeKeyboard`:

```tsx
  const {
    size = "s",
    offCanvas,
    controller,
    children,
    ref,
    className,
    offCanvasOrientation = "right",
    showCloseButton,
    ...overlayProps
  } = props;

  const stringFormatter = useLocalizedStringFormatter(locales, "Modal");

  const keyboardVisible = useVirtualKeyboardVisible();
```

Delete both spike `useEffect` blocks (the variant-C `focusin` scroll handler and the variant-D `visualViewport` detector) and the `keyboardOpen`/`vp` state entirely.

- [ ] **Step 5: Update `rootClassName`**

```tsx
  const rootClassName = clsx(
    offCanvas ? styles.offCanvas : styles.modal,
    styles[`size-${size}`],
    offCanvasOrientation === "left" && styles["left"],
    keyboardVisible && styles.keyboardVisible,
    className,
  );
```

- [ ] **Step 6: Ensure the return is the plain `<Overlay>`**

Confirm the component returns `<Overlay …>…</Overlay>` directly (no debug-badge fragment left from the spike). If a `<>…</>` wrapper or debug `<div>` remains, remove it so the return is exactly:

```tsx
  return (
    <Overlay
      className={rootClassName}
      controller={controller}
      ref={ref}
      aria-labelledby={generatedId}
      {...overlayProps}
    >
      <PropsContextProvider props={propsContext}>
        <Wrap if={offCanvas}>
          <Suspense fallback={<OffCanvasSuspenseFallback />}>
            {children}
          </Suspense>
        </Wrap>
      </PropsContextProvider>
    </Overlay>
  );
```

- [ ] **Step 7: Typecheck**

Run: `corepack pnpm --filter @mittwald/flow-react-components test:compile`
Expected: PASS (0 errors). If it reports unused `spikeVariant` anywhere else, grep `grep -rn "spikeVariant\|spikeKeyboard" packages/components/src` and remove stragglers (the spike story is handled in Task 5).

- [ ] **Step 8: Commit**

```bash
git add packages/components/src/components/Modal/Modal.tsx
git commit -m "fix(Modal): drive mobile keyboard layout via useVirtualKeyboardVisible"
```

---

### Task 3: Production mobile CSS (single scroll, sticky header + footer, keyboard-aware)

Fold the validated spike-D styles into the real mobile block and delete the spike block.

**Files:**
- Modify: `packages/components/src/components/Modal/Modal.module.scss`

- [ ] **Step 1: Delete the entire spike block**

Remove the block that starts with the comment `/* SPIKE(#2423): mobile-keyboard layout variants … */` and contains `.modal.spikeA`, `.modal.spikeC`, `.modal.spikeD`, `.modal.spikeD.keyboardOpen` — the whole `@media (max-width: 768px) { … }` spike group, up to (not including) `/* Animations */`.

- [ ] **Step 2: Rewrite the "Mobile Tray" media block**

Replace the existing `/* Mobile Tray */` block:

```scss
/* Mobile Tray */

@media (max-width: 768px) {
  .modal {
    > div {
      > div {
        margin-top: auto;
        padding: unset;
        width: 100%;
        overflow: hidden auto;
        border-top-left-radius: var(--modal--corner-radius);
        border-top-right-radius: var(--modal--corner-radius);
        pointer-events: all;

        &[data-entering] {
          animation: modal-slide-up var(--transition--duration--slow);
        }

        &[data-exiting] {
          animation: modal-slide-up var(--transition--duration--default) reverse;
        }
      }
    }

    [role="dialog"],
    [role="dialog"] > form {
      width: inherit;
      overflow: hidden auto;
      max-height: unset;
    }
  }
}
```

with this (bottom-sheet look preserved; the dialog is now the single scroll container; header/footer sticky):

```scss
/* Mobile Tray — single scroll container with sticky header + footer.
   The dialog scrolls; header sticks to the top, footer to the bottom. While the
   virtual keyboard is open (.keyboardVisible) both un-stick so header + content
   + footer flow normally and the content gets the full space (issue #2423). */

@media (max-width: 768px) {
  .modal {
    > div {
      > div {
        margin-top: auto;
        padding: unset;
        width: 100%;
        overflow: hidden;
        border-top-left-radius: var(--modal--corner-radius);
        border-top-right-radius: var(--modal--corner-radius);
        pointer-events: all;

        &[data-entering] {
          animation: modal-slide-up var(--transition--duration--slow);
        }

        &[data-exiting] {
          animation: modal-slide-up var(--transition--duration--default) reverse;
        }
      }
    }

    [role="dialog"] {
      width: inherit;
      overflow: hidden auto;
      max-height: var(--visual-viewport-height);
    }

    [role="dialog"] > form {
      width: inherit;
    }

    /* flex: 0 0 auto keeps natural heights; without flex-shrink:0 the flex column
       compresses the content box and the (overflow:visible) fields spill over the
       footer. */
    .header,
    .content,
    .columnLayout,
    .actionGroup {
      flex: 0 0 auto;
    }

    .content,
    .columnLayout {
      overflow: visible;
      min-height: 0;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: var(--modal--background-color);
    }

    .actionGroup {
      position: sticky;
      bottom: 0;
      z-index: 1;
    }
  }

  /* Keyboard open: un-stick both so everything flows for maximum typing space.
     The dialog fills the available height and the footer uses margin-top:auto,
     so with SHORT content the footer still sits at the bottom (not mid-air), and
     with tall content it scrolls away with everything else. Never hidden. */
  .modal.keyboardVisible {
    [role="dialog"] {
      min-height: var(--visual-viewport-height);
    }

    .header,
    .actionGroup {
      position: static;
    }

    .actionGroup {
      margin-top: auto;
    }
  }
}
```

- [ ] **Step 3: Verify the compiled class name matches the JS**

Confirm the CSS-module class is `keyboardVisible` (camelCase in SCSS → the module export `styles.keyboardVisible` used in Task 2). The generated global class will be `flow--modal--keyboard-visible`; no code depends on that string except the browser test in Task 4.

- [ ] **Step 4: Manual visual check in Storybook**

Run: `corepack pnpm --filter @mittwald/flow-react-components dev` (Storybook on :6006). Open **Overlays / Modal → Default** (or the mobile spike story if still present), set the viewport ≤768px wide, and confirm: header sticks to the top, footer sticks to the bottom, content scrolls between them, and scrolling to the bottom shows the footer cleanly (no fields spilling over it). Stop the server when done.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/components/Modal/Modal.module.scss
git commit -m "fix(Modal): single-scroll mobile layout with keyboard-aware sticky chrome (#2423)"
```

---

### Task 4: Browser test for the mobile rest-state layout

Lock the CSS contract: at a mobile viewport the mobile Modal is one scroll container with a sticky header and sticky footer. (The keyboard-open toggle is covered by Task 1's unit test + device verification; simulating the VisualViewport keyboard in CI is out of scope.)

**Files:**
- Modify: `packages/core/src/vitestBrowserTestConfig.ts` (add a `setViewportSize` browser command)
- Modify: `packages/components/src/components/Modal/Modal.browser.test.tsx`

**Interfaces:**
- Consumes: `commands.setViewportSize(width, height)` (new).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add a `setViewportSize` browser command**

In `packages/core/src/vitestBrowserTestConfig.ts`, add alongside `setReducedMotion`:

```ts
const setViewportSize: BrowserCommand<[width: number, height: number]> = async (
  { page },
  width,
  height,
) => {
  await page.setViewportSize({ width, height });
};
```

and register it in the `commands` object:

```ts
    commands: {
      setReducedMotion,
      setViewportSize,
    },
```

- [ ] **Step 2: Write the failing browser test**

Append to `packages/components/src/components/Modal/Modal.browser.test.tsx` (imports `render` from `vitest-browser-react`, `page`/`commands` from `vitest/browser` already used in the file — add any missing ones):

```tsx
test("mobile Modal is a single scroll container with sticky header and footer", async () => {
  await commands.setViewportSize(375, 720);

  const dom = await render(
    <Modal isOpen>
      <Heading>New customer</Heading>
      <Content>
        <Text>{longText}</Text>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button>Save</Button>
        </Action>
      </ActionGroup>
    </Modal>,
  );

  const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
  const header = dialog.querySelector(
    '[class*="modal--header"]',
  ) as HTMLElement;
  const footer = dialog.querySelector(
    '[class*="action-group"]',
  ) as HTMLElement;

  // the dialog itself is the scroll container
  expect(getComputedStyle(dialog).overflowY).toBe("auto");
  expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight);

  // header sticks to the top, footer to the bottom
  expect(getComputedStyle(header).position).toBe("sticky");
  expect(getComputedStyle(footer).position).toBe("sticky");

  await commands.setViewportSize(1280, 720);
  dom.unmount();
});
```

Add at the top of the file (after imports) a long filler so the content overflows 720px:

```tsx
import Heading from "@/components/Heading";
import { ActionGroup } from "@/components/ActionGroup";
import { Action } from "@/components/Action";

const longText = Array.from({ length: 40 }, (_, i) => `Line ${i + 1}`).join(" ");
```

(Only add imports not already present in the file.)

- [ ] **Step 3: Run the test to verify it fails on `main`-baseline styling**

Run: `corepack pnpm --filter @mittwald/flow-react-components exec vitest run --project=browser --browser.headless src/components/Modal/Modal.browser.test.tsx -t "single scroll container"`
Expected: FAIL before Tasks 2–3 land (footer/header would not be `sticky`). If Tasks 2–3 are already committed, it should PASS — in that case temporarily assert `position === "static"` to confirm the test exercises the code, then revert to `"sticky"`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `corepack pnpm --filter @mittwald/flow-react-components exec vitest run --project=browser --browser.headless src/components/Modal/Modal.browser.test.tsx -t "single scroll container"`
Expected: PASS.

- [ ] **Step 5: Run the full Modal browser suite to catch regressions**

Run: `corepack pnpm --filter @mittwald/flow-react-components exec vitest run --project=browser --browser.headless src/components/Modal/Modal.browser.test.tsx`
Expected: PASS (existing tests unaffected — they render at the restored 1280×720).

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/vitestBrowserTestConfig.ts packages/components/src/components/Modal/Modal.browser.test.tsx
git commit -m "test(Modal): assert mobile single-scroll sticky-chrome layout"
```

---

### Task 5: Remove spike artifacts + refresh stories, docs, and visual snapshots

**Files:**
- Delete: `packages/components/src/components/Modal/stories/MobileKeyboardSpike.stories.tsx`
- Delete: `packages/components/src/components/Modal/stories/SPIKE-2423-NOTES.md`
- Delete: `.claude/launch.json` (throwaway Storybook launch config)
- Modify: `packages/components/src/components/Modal/stories/Default.stories.tsx` (add a long-form mobile story)

- [ ] **Step 1: Delete the spike artifacts**

```bash
git rm packages/components/src/components/Modal/stories/MobileKeyboardSpike.stories.tsx packages/components/src/components/Modal/stories/SPIKE-2423-NOTES.md
rm -f .claude/launch.json
```

- [ ] **Step 2: Add a realistic long-form story**

In `packages/components/src/components/Modal/stories/Default.stories.tsx`, add a story that exercises a tall form (so the mobile scroll behavior is demonstrable in Storybook's mobile viewport). Reuse the existing imports in that file; example:

```tsx
export const LongForm: Story = {
  render: (props) => (
    <Modal {...props} isDefaultOpen>
      <Heading>New customer</Heading>
      <Content>
        <Section>
          <Text>Create a new customer.</Text>
          {[
            "Company name",
            "Contact person",
            "Email address",
            "Phone number",
            "Street and house number",
            "Postal code",
            "City",
            "VAT ID",
          ].map((label) => (
            <TextField key={label}>
              <Label>{label}</Label>
            </TextField>
          ))}
        </Section>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button color="accent">Create customer</Button>
        </Action>
        <Action closeModal>
          <Button color="secondary" variant="soft">
            Abort
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  ),
};
```

- [ ] **Step 3: Typecheck + lint**

Run: `corepack pnpm --filter @mittwald/flow-react-components test:compile`
Run: `pnpm lint`
Expected: PASS. Fix any `spikeVariant`/`spikeKeyboard` leftovers surfaced by grep: `grep -rn "spike" packages/components/src/components/Modal` should return nothing.

- [ ] **Step 4: Refresh visual snapshots (Linux baseline)**

The mobile Modal layout changed, so the committed visual baselines must be regenerated. Do NOT commit local macOS `-darwin` snapshots as the fix. Instead, on the PR apply the **`update-screenshots`** label to regenerate the `-webkit-linux` baseline in CI, and the **`run-visual-tests`** label to verify. Locally you may sanity-check with:

Run: `pnpm nx test:visual:update remote-react-components` (regenerates `-darwin` only — for local inspection, not for commit).

Note in the PR description that snapshot updates are expected for Modal.

- [ ] **Step 5: Commit**

```bash
git add packages/components/src/components/Modal/stories/Default.stories.tsx
git rm --cached .claude/launch.json 2>/dev/null || true
git commit -m "chore(Modal): remove #2423 spike scaffolding; add long-form story"
```

---

### Task 6: End-to-end verification

- [ ] **Step 1: Unit + browser tests**

Run: `corepack pnpm --filter @mittwald/flow-react-components test:unit`
Run: `corepack pnpm --filter @mittwald/flow-react-components exec vitest run --project=browser --browser.headless src/components/Modal`
Expected: PASS.

- [ ] **Step 2: Typecheck + lint (whole affected graph)**

Run: `pnpm affected:test`
Expected: PASS.

- [ ] **Step 3: Device sanity (manual, if a device/simulator is available)**

Storybook via `corepack pnpm --filter @mittwald/flow-react-components dev`, open the top-level `http://<LAN-IP>:6006/iframe.html?id=overlays-modal--long-form&viewMode=story` on a phone/simulator, focus a field, confirm: header + footer un-stick while typing, content fills the space, footer reachable by scrolling; on blur they re-dock. Also test a **short form** (few fields): while the keyboard is open the footer must sit at the bottom, not mid-air (this is what the `min-height` + `margin-top:auto` in the `.keyboardVisible` rule guarantees). (VisualViewport keyboard detection only works on the top-level `iframe.html`, not inside the Storybook manager iframe.)

- [ ] **Step 4: Open the PR**

Reference issue #2423. Note expected Modal visual-snapshot changes and that the `update-screenshots` + `run-visual-tests` labels should be applied. No `MIGRATION.md`/codemod needed (no public API change).
