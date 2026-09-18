<!-- prettier-ignore -->
<!-- This file is auto-generated with the icon generator -->
<script lang="ts">
  /* Tabler Icons — MIT License, Copyright (c) 2020-2026 Paweł Kuna. See LICENSE. */
  import Icon from "../auto-generated/Icon.svelte";
  import type { FlowIconProps } from "../lib/iconProps.js";
  import { useContextIcon } from "../lib/iconSet.js";

  let props: FlowIconProps = $props();

  const ContextIcon = useContextIcon("Vhost");
</script>

{#if ContextIcon}<Icon {...props}><ContextIcon /></Icon>{:else}<Icon {...props}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-world-share"><path d="M20.94 13.045a9 9 0 1 0 -8.953 7.955" /><path d="M3.6 9h16.8" /><path d="M3.6 15h9.4" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.991 16.991 0 0 1 2.529 10.294" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" /></svg></Icon>{/if}
