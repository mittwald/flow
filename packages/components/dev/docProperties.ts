/**
 * The two doc-properties artefacts and who they are for.
 *
 * The full `react-docgen-typescript` dump is a build input: the component
 * index, the status registry and the remote-components generator all read it,
 * and the remote generator turns _every_ prop into a remote prop, so it needs
 * the inherited ones too. It stays outside `dist`, which `files` ships
 * wholesale.
 *
 * The published file under `./doc-properties` keeps the same `ComponentDoc[]`
 * shape but only the props a consumer can act on — the same filter the
 * component index applies.
 */
export const docPropertiesInternalFile = ".cache/doc-properties.json";

export const docPropertiesPublishedFile = "dist/assets/doc-properties.json";

/** The internal file as seen from the workspace root. */
export const docPropertiesInternalFileFromRoot = `packages/components/${docPropertiesInternalFile}`;
