import type { Transform } from "jscodeshift";
import flowAlphaAccentBoxColorToBackgroundColor from "../transforms/flowAlphaAccentBoxColorToBackgroundColor";
import flowAlphaActionPropToOnAction from "../transforms/flowAlphaActionPropToOnAction";
import flowAlphaButtonPropsInterfaces from "../transforms/flowAlphaButtonPropsInterfaces";
import flowAlphaMutedActionErrorToAbortActionError from "../transforms/flowAlphaMutedActionErrorToAbortActionError";
import flowAlphaPasswordToolsRule from "../transforms/flowAlphaPasswordToolsRule";
import flowAlphaAlignToCombine from "../transforms/flowAlphaAlignToCombine";
import flowAlphaButtonColorAccentToSuccess from "../transforms/flowAlphaButtonColorAccentToSuccess";
import flowAlphaColorPrimaryToDefault from "../transforms/flowAlphaColorPrimaryToDefault";

/**
 * Runs every codemod on the way to `1.0.0` in one pass, in the order the
 * changes were released. Use it to catch up from an older `0.2.0-alpha` in one
 * go instead of running the transforms one by one.
 *
 * It is not the whole migration. Most entries in the migration guide have no
 * codemod and need a hand — this covers the renames a script can do.
 *
 * Two transforms in `src/transforms` are deliberately **not** part of it:
 *
 * - `flowRemote` converts an app to `@mittwald/flow-remote-react-components`.
 *   That is a port to a different package, not a migration, and running it on a
 *   normal app would rewrite every Flow import.
 * - `flow020` migrates `0.1.0` to `0.2.0` by collapsing subpath imports onto the
 *   package root. Since then the package gained subpath entries it does not
 *   know about (`/internal`, `/flr-universal`, `/mittwald-password-tools-js`),
 *   so on a current codebase it would break those imports. Run it separately,
 *   and only when coming from `0.1.0`.
 */
const flow1Transform: Transform = (fileInfo, api, options) => {
  /** Ordered by the release the respective change shipped in. */
  const transforms: Transform[] = [
    flowAlphaButtonPropsInterfaces, // alpha.646
    flowAlphaActionPropToOnAction, // alpha.646
    flowAlphaMutedActionErrorToAbortActionError, // alpha.712
    flowAlphaAccentBoxColorToBackgroundColor, // alpha.786
    flowAlphaPasswordToolsRule, // alpha.802
    flowAlphaColorPrimaryToDefault, // alpha.846
    flowAlphaButtonColorAccentToSuccess, // alpha.1046
    flowAlphaAlignToCombine, // alpha.1047
  ];

  let source = fileInfo.source;

  for (const transform of transforms) {
    // A transform returns the unchanged source, or nothing at all, when it does
    // not apply — both mean "keep what we have" and must not end the chain.
    const result = transform({ ...fileInfo, source }, api, options);
    if (typeof result === "string") {
      source = result;
    }
  }

  return source;
};

export default flow1Transform;
