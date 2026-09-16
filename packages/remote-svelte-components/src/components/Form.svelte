<script lang="ts">
  import { RemoteFormElement } from "@mittwald/flow-remote-elements";
  import type { RemoteFormElementProps } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  /**
   * Hand-written, like its React counterpart: `flr-form` has no Flow component
   * behind it, so the generator never sees it.
   *
   * Unlike React's, this one adds nothing — that version wraps a function
   * `action` in `startTransition`, which is React's own scheduling.
   */
  let props: FlowRemoteProps<RemoteFormElementProps> = $props();
</script>

<RemoteElement
  tag="flr-form"
  name="Form"
  element={RemoteFormElement}
  {...props}
/>
