import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { transformsDir } from "./runTransform";
import { declaredPackages, packageEntries, remoteExports } from "./remoteScope";

const remotePackage = "@mittwald/flow-remote-react-components";

/**
 * `@mittwald/flow-remote-react-components` mirrors the component API, so most
 * codemods apply to it as well — but only most. The remote package exports the
 * `@flr-generate` components and nothing else: no prop types, no error classes,
 * and only three entries against the main package's nine. A transform that
 * scopes itself to the remote package anyway either does nothing there (noise
 * that reads as coverage) or, worse, rewrites an import onto a name the package
 * does not have — which is the failure a codemod is supposed to remove.
 *
 * So the rule is not decided per transform, it is derived: a transform may
 * claim the remote package exactly when something it targets exists there.
 */
const targets: Record<string, string[]> = {
  flow020: [],
  flow1: [],
  flowAlphaAccentBoxColorToBackgroundColor: ["AccentBox"],
  flowAlphaActionPropToOnAction: ["Action"],
  flowAlphaAlignToCombine: ["Align", "AlignProps"],
  flowAlphaButtonColorAccentToSuccess: ["Button", "SubmitButton"],
  flowAlphaButtonPropsInterfaces: ["ResetButtonProps", "SubmitButtonProps"],
  flowAlphaColorPrimaryToDefault: [
    "Breadcrumb",
    "HeaderNavigation",
    "Heading",
    "IllustratedMessage",
    "Link",
  ],
  flowAlphaMutedActionErrorToAbortActionError: ["MutedActionError"],
  flowAlphaPasswordToolsRule: ["AsyncRule", "SyncRule"],
  flowRemote: [],
};

/**
 * `flow1` is the generated bundle — its scope is the union of the transforms it
 * inlines, each checked on its own. `flow020` and `flowRemote` are about the
 * package layout itself rather than about names in it.
 */
const notNameScoped = new Set(["flow1", "flow020", "flowRemote"]);

const transformNames = readdirSync(transformsDir)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => file.replace(/\.ts$/, ""));

describe("a transform claims the remote package only where it applies", () => {
  test("every transform is listed", () => {
    expect(transformNames.toSorted()).toEqual(Object.keys(targets).toSorted());
  });

  test.for(transformNames.filter((name) => !notNameScoped.has(name)))(
    "%s",
    (name) => {
      const claimsRemote = declaredPackages(name).some((entry) =>
        entry.startsWith(remotePackage),
      );
      const reachable = (targets[name] ?? []).some((target) =>
        remoteExports.has(target),
      );

      expect({ name, claimsRemote }).toEqual({
        name,
        claimsRemote: reachable,
      });
    },
  );
});

describe("every scoped entry is one a consumer can import", () => {
  test.for(transformNames.filter((name) => name !== "flow1"))("%s", (name) => {
    for (const entry of declaredPackages(name)) {
      expect(packageEntries).toContain(entry);
    }
  });
});
