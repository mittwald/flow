<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";
  import Content from "../../auto-generated/Content.svelte";
  import Text from "../../auto-generated/Text.svelte";
  import Popover from "../../overlays/Popover.svelte";
  import PopoverTrigger from "../../overlays/OverlayTrigger.svelte";
</script>

<PopoverTrigger>
  <Button>Details</Button>
  <Popover>
    <Content><Text>Twelve pilots ready.</Text></Content>
  </Popover>
</PopoverTrigger>
