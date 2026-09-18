/*
 * The Svelte remote app under `src/app/remote-svelte` is plain JavaScript —
 * `lang="ts"` would need a preprocessor, and a Turbopack rule's options have to
 * be serializable. So its components carry no prop types, and this declaration
 * is all TypeScript needs to accept the imports.
 *
 * The type is written as an `import()` annotation on purpose: a wildcard module
 * declaration only works in a global file, and a top-level `import` would turn
 * this one into a module.
 */
declare module "*.svelte" {
  /* eslint-disable-next-line @typescript-eslint/consistent-type-imports, @typescript-eslint/no-explicit-any */
  const component: import("svelte").Component<any>;
  export default component;
}
