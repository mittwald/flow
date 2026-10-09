<!-- prettier-ignore -->
<!-- This file is auto-generated with the icon generator -->
<script lang="ts">
  /* Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See LICENSE. */
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("Notification");
</script>

{#if ContextIcon}<Icon {...props}><ContextIcon /></Icon>{:else}<Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-bell"><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg></Icon>{/if}
