import jetpack from "fs-jetpack";
import * as path from "path";

const contentDir = "src/content";

/**
 * Every example under `src/content`, addressed by its page's content path plus
 * its name: `src/content/components/content/heading/examples/badge.tsx` is
 * `components/content/heading/badge` — the path `/example-preview/` serves and
 * a release-figure spec names.
 */
export const listExamplePaths = (): string[] =>
  jetpack
    .find(contentDir, { matching: "**/examples/*.tsx" })
    .map((file) =>
      path
        .relative(contentDir, file)
        .replace(/\/examples\/([^/]+)\.tsx$/, "/$1"),
    )
    .sort();

/** The example's source, or `undefined` for a path that names none. */
export const readExample = (examplePath: string): string | undefined => {
  if (!listExamplePaths().includes(examplePath)) {
    return undefined;
  }

  const name = path.basename(examplePath);
  const file = path.join(
    contentDir,
    path.dirname(examplePath),
    "examples",
    `${name}.tsx`,
  );

  return jetpack.read(file);
};
