<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";
  import { useWarnDeprecation } from "../../lib/deprecation.js";

  const warnDeprecation = useWarnDeprecation();
</script>

<Button
  onPress={() => {
    warnDeprecation("The 'x' prop is deprecated.");
    warnDeprecation("The 'x' prop is deprecated.");
  }}>Warn twice</Button
>
