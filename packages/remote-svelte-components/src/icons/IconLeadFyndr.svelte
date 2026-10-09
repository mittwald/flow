<!-- prettier-ignore -->
<!-- This file is auto-generated with the icon generator -->
<script lang="ts">
  /* Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See LICENSE. */
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("LeadFyndr");
</script>

{#if ContextIcon}<Icon {...props}><ContextIcon /></Icon>{:else}<Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-radar-2"><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M15.51 15.56a5 5 0 1 0 -3.51 1.44" /><path d="M18.832 17.86a9 9 0 1 0 -6.832 3.14" /><path d="M12 12v9" /></svg></Icon>{/if}
