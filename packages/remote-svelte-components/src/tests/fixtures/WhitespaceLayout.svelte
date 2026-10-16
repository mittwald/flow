<script lang="ts">
  import Heading from "../../auto-generated/Heading.svelte";
  import Section from "../../auto-generated/Section.svelte";
  import Text from "../../auto-generated/Text.svelte";

  const count = 5;
  const unit = "pilots";
</script>

<!--
  Written the way a Svelte template is normally written, with the children on
  their own lines. The whitespace between them is what must not reach the host —
  and the space inside the last `Text`, between two expressions, is what must.
-->
<Section>
  <Heading>Squadron</Heading>

  <Text>{count} {unit}</Text>
</Section>
