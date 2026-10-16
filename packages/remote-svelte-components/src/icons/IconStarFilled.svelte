<!-- prettier-ignore -->
<!-- This file is auto-generated with the icon generator -->
<script lang="ts">
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("StarFilled");
</script>

{#if ContextIcon}<Icon {...props}><ContextIcon /></Icon>{:else}<Icon {...props}><svg viewBox="0 0 21 20" height="20" width="21" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path d="M10.4614 0L13.5003 6.81738L20.923 7.60081L15.3784 12.5976L16.9271 19.8992L10.4614 16.17L3.99579 19.8992L5.54446 12.5976L-0.000195503 7.60081L7.42258 6.81738L10.4614 0Z" /></svg></Icon>{/if}
