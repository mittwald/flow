<!-- prettier-ignore -->
<!-- This file is auto-generated with the icon generator -->
<script lang="ts">
  /* Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See LICENSE. */
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("Redo");
</script>

{#if ContextIcon}<Icon {...props}><ContextIcon /></Icon>{:else}<Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-arrow-forward-up"><path d="M15 14l4 -4l-4 -4" /><path d="M19 10h-11a4 4 0 1 0 0 8h1" /></svg></Icon>{/if}
