<script lang="ts">
  import ProgressBar from "../../auto-generated/ProgressBar.svelte";
  import Text from "../../auto-generated/Text.svelte";
</script>

<ProgressBar value={42} aria-label="Upload">
  {#snippet valueLabel()}<Text>Almost there</Text>{/snippet}
</ProgressBar>
