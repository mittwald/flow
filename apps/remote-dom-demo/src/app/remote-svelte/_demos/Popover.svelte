<script>
  import {
    Button,
    Popover,
    PopoverTrigger,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";
</script>

<Section>
  <PopoverTrigger>
    <Button>Show battle station status</Button>
    <Popover>
      <Text>The Death Star is fully operational.</Text>
    </Popover>
  </PopoverTrigger>
</Section>
