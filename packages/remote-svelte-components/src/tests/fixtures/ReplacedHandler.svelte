<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";

  const { pressed }: { pressed: string[] } = $props();

  let round = $state(1);
</script>

<Button
  onPress={() => {
    pressed.push(`round ${round}`);
    round++;
  }}
>Round {round}</Button>
