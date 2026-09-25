<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Renders its children. That is the whole component, and it is the honest
   * translation.
   *
   * React's `IntlProvider` is react-aria's `I18nProvider`: a context that sets
   * the locale for the react-aria components rendered **below it in React**. In
   * a remote app those are `flr-*` elements, which render on the host — so even
   * there the provider only reaches what the extension renders locally, and a
   * Svelte app renders nothing locally at all.
   *
   * It exists so the documented `flr-universal` surface is complete: an app
   * written against a React example imports and composes the same way. The
   * locale that decides what the host renders is the host's, and
   * `useLanguage()` is how to read it.
   */
  interface Props {
    /**
     * Declared for parity with the React component, and deliberately unused:
     * there is no local react-aria to configure. The locale the host renders in
     * is the host's — read it with `useLanguage()`.
     */
    locale?: string;
    children?: Snippet;
  }

  const { children }: Props = $props();
</script>

{@render children?.()}
