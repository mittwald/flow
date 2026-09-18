<script lang="ts">
  import { RemoteFormElement } from "@mittwald/flow-remote-elements";
  import type { RemoteFormElementProps } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  /**
   * Hand-written, like its React counterpart: `flr-form` has no Flow component
   * behind it, so the generator never sees it. Written in the generated shape —
   * literal tag, content branched outside the element — for the reason spelled
   * out in `RemoteElement.svelte`.
   *
   * Unlike React's, this one adds nothing — that version wraps a function
   * `action` in `startTransition`, which is React's own scheduling.
   */
  let { children, ...props }: FlowRemoteProps<RemoteFormElementProps> =
    $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-form", name: "Form", element: RemoteFormElement },
    () => props,
  );

  const hasContent = $derived(children !== undefined);
</script>

{#if hasContent}<flr-form
    bind:this={element.node}
  >{@render children?.()}</flr-form>{:else}<flr-form bind:this={element.node}></flr-form>{/if}
