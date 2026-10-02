import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/*
 * `lang="ts"` in a component is a preprocessor, not something the Svelte
 * compiler understands. Both `svelte-package` and `svelte-check` read this file
 * to find it, so the build and the type check see the same source the dev
 * server does.
 */
export default {
  preprocess: vitePreprocess(),
};
