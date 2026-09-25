<script lang="ts">
  import DeprecationWarningProvider from "../../components/DeprecationWarningProvider.svelte";
  import DeprecationWarner from "./DeprecationWarner.svelte";

  const { onWarning }: { onWarning: (message: string) => void } = $props();
</script>

<DeprecationWarningProvider {onWarning}><DeprecationWarner /></DeprecationWarningProvider>
