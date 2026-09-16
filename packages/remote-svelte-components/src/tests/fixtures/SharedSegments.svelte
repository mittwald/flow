<script lang="ts">
  import DonutChart from "../../auto-generated/DonutChart.svelte";
  import Flex from "../../auto-generated/Flex.svelte";

  const { segments }: { segments: { value: number; title: string }[] } =
    $props();
</script>

<Flex gap="s"><DonutChart
    aria-label="first"
    value={40}
    {segments}
  /><DonutChart aria-label="second" value={40} {segments} /></Flex>
