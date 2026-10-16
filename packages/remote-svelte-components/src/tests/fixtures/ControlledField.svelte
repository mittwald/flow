<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";
  import Label from "../../auto-generated/Label.svelte";
  import TextField from "../../auto-generated/TextField.svelte";

  const {
    onChange,
    valueFromTheRemoteSide,
  }: { onChange?: (value: string) => void; valueFromTheRemoteSide: string } =
    $props();

  let value = $state("");
</script>

<TextField
  {value}
  onChange={(next: string) => {
    value = next;
    onChange?.(next);
  }}
><Label>Passphrase</Label></TextField>
<Button onPress={() => (value = valueFromTheRemoteSide)}>Overwrite</Button>
