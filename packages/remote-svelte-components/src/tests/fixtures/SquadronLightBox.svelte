<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";
  import Content from "../../auto-generated/Content.svelte";
  import Text from "../../auto-generated/Text.svelte";
  import LightBox from "../../overlays/LightBox.svelte";
  import LightBoxTrigger from "../../overlays/OverlayTrigger.svelte";
</script>

<LightBoxTrigger>
  <Button>Show</Button>
  <LightBox>
    <Content><Text>The squadron in formation.</Text></Content>
  </LightBox>
</LightBoxTrigger>
