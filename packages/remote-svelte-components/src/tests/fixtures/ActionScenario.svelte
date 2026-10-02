<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";
  import Action from "../../components/Action.svelte";

  const {
    onAction,
    successDuration = 2000,
  }: { onAction?: () => unknown; successDuration?: number } = $props();
</script>

<Action {onAction} {successDuration}><Button>Run</Button></Action>
