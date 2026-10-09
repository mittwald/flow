<script lang="ts">
  import type { RemoteReceiver } from "@mittwald/flow-remote-core";
  import type { Component } from "svelte";
  import RemoteRoot from "../../components/RemoteRoot.svelte";

  /**
   * Renders one component below a `RemoteRoot`, so a test can hand
   * `renderRemote` a plain component instead of building a snippet by hand.
   */
  interface Props {
    receiver: RemoteReceiver;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: Component<any>;
    componentProps?: Record<string, unknown>;
  }

  const { receiver, component: Child, componentProps = {} }: Props = $props();
</script>

<RemoteRoot __remoteReceiver={receiver}><Child {...componentProps} /></RemoteRoot>
