<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";

  let handled = $state(true);
</script>

<Button
  onPress={handled ? () => (handled = false) : undefined}
>{handled ? "Handled" : "Unhandled"}</Button>
