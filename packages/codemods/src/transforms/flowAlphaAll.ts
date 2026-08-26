import type { Transform } from "jscodeshift";
import flowAlphaActionPropToOnAction from "./flowAlphaActionPropToOnAction";
import flowAlphaAlignToCombine from "./flowAlphaAlignToCombine";
import flowAlphaButtonColorAccentToSuccess from "./flowAlphaButtonColorAccentToSuccess";
import flowAlphaColorPrimaryToDefault from "./flowAlphaColorPrimaryToDefault";

/**
 * Runs every `0.2.0-alpha` migration codemod in one pass, in the order the
 * changes were released. Use it to catch up from an older alpha in one go
 * instead of running the transforms one by one.
 *
 * Two transforms in this folder are deliberately **not** part of it:
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
const flowAlphaAllTransform: Transform = (fileInfo, api, options) => {
  /** Ordered by the release the respective change shipped in. */
  const transforms: Transform[] = [
    flowAlphaActionPropToOnAction, // alpha.646
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

export default flowAlphaAllTransform;
