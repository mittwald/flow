import type { Transform } from "jscodeshift";

/**
 * Ports imports from `@mittwald/flow-react-components` to
 * `@mittwald/flow-remote-react-components`.
 *
 * Not a migration: no version range calls for it, so it has no catalogue entry
 * (see `notAMigration` in `src/tests/remoteScope.test.ts`) and lives outside
 * `src/migrations`, in `src/tools` alongside any other transform the CLI runs
 * by id without a matching entry. It is still resolved and run the same way a
 * migration's `transform.ts` is — `transformExists`/`runCodemod` in
 * `src/run/jscodeshift.ts` fall back to this directory when an id names no
 * migration.
 */
const toRemotePackageTransform: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value).startsWith(flowPackage))
    .forEach((i) => {
      const importPath = String(i.node.source.value);

      i.node.source.value = importPath.replace(
        flowPackage,
        "@mittwald/flow-remote-react-components",
      );
    });

  return root.toSource();
};

export default toRemotePackageTransform;
