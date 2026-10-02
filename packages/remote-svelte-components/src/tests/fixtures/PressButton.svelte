<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";

  const { onPress }: { onPress: () => void } = $props();
</script>

<Button {onPress}>Press me</Button>
