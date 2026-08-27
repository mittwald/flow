import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { readCatalog } from "../catalog/read";
import { transformsDir } from "./runTransform";
import { declaredPackages, packageEntries, remoteExports } from "./remoteScope";

/**
 * `@mittwald/flow-remote-react-components` mirrors the component API, so most
 * catalogue entries apply to it as well — but only most. The remote package
 * exports the `@flr-generate` components and nothing else: no prop types, no
 * error classes, and only three entries against the main package's nine. An
 * entry that claims the remote package anyway either promises a codemod run
 * that does nothing there (noise that reads as coverage) or, worse, describes
 * an API the package does not have.
 *
 * So the rule is not decided per entry, it is derived: an entry may claim the
 * remote package exactly when something it targets exists there. `targets` is
 * hand-maintained — the catalogue schema has no such field — which is exactly
 * what makes this a check instead of a second guess: `remotePackage` in the
 * frontmatter is asserted against, never read into, the computation below.
 */
const targets: Record<string, string[]> = {
  "segmented-control-deprecated": ["SegmentedControl", "Segment"],
  "align-to-combine": ["Align", "AlignProps"],
  "button-color-accent-to-success": ["Button", "SubmitButton"],
  "tooltip-trigger-delay-type": ["TooltipTrigger"],
  "modal-unsaved-changes-confirmation": ["Modal"],
  "flags-to-component-defaults-provider": [
    "flags",
    "ComponentDefaultsProvider",
  ],
  "table-column-width-props": ["TableColumn"],
  "table-render-prop-removed": ["Table"],
  "table-cell-render-prop-removed": ["TableCell"],
  "color-primary-to-default": [
    "Breadcrumb",
    "HeaderNavigation",
    "Heading",
    "IllustratedMessage",
    "Link",
  ],
  "password-tools-rule": ["Rule", "AsyncRule", "SyncRule"],
  "cartesian-chart-restructured": [
    "CartesianChart",
    "XAxis",
    "typedCartesianChart",
  ],
  "accent-box-color-to-background-color": ["AccentBox"],
  "code-block-syntax-highlighter-removed": ["CodeBlock"],
  "muted-action-error-to-abort-action-error": [
    "MutedActionError",
    "AbortActionError",
  ],
  "form-resets-after-modal-close": ["Form"],
  "overlay-controller-add-on-close-return-type": ["OverlayController"],
  "cartesian-chart-empty-view": ["CartesianChart"],
  "action-prop-to-on-action": ["Action", "ActionProps"],
  "button-props-interfaces": [
    "ResetButtonProps",
    "SubmitButtonProps",
    "ButtonProps",
    "RemoteButtonElementProps",
  ],
  "imports-to-package-root": [],
  "renamed-css-export": [],
};

/**
 * These two are about the package layout itself rather than about names in it,
 * so there is nothing to look up in `remoteExports`.
 */
const notNameScoped = new Set([
  "imports-to-package-root",
  "renamed-css-export",
]);

const catalog = readCatalog();
const remotePackageById = new Map(
  catalog.map((entry) => [entry.id, entry.remotePackage]),
);
const catalogIds = catalog.map((entry) => entry.id);

describe("a catalogue entry claims the remote package only where it applies", () => {
  test("every entry is listed", () => {
    expect(catalogIds.toSorted()).toEqual(Object.keys(targets).toSorted());
  });

  test.for(catalogIds.filter((id) => !notNameScoped.has(id)))("%s", (id) => {
    const remotePackage = remotePackageById.get(id);
    const reachable = (targets[id] ?? []).some((target) =>
      remoteExports.has(target),
    );

    expect({ id, remotePackage }).toEqual({ id, remotePackage: reachable });
  });
});

const transformNames = readdirSync(transformsDir)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => file.replace(/\.ts$/, ""));

describe("every scoped entry is one a consumer can import", () => {
  test.for(transformNames.filter((name) => name !== "flow1"))("%s", (name) => {
    for (const entry of declaredPackages(name)) {
      expect(packageEntries).toContain(entry);
    }
  });
});
