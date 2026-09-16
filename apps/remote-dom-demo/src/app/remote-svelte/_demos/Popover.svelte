<script>
  import {
    Button,
    Content,
    Heading,
    Popover,
    PopoverTrigger,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";
</script>

<Section>
  <Heading>Squadron</Heading>
  <PopoverTrigger>
    <Button variant="outline">Details</Button>
    <Popover withTip={true}>
      <Content><Text>Twelve pilots, four X-wings, one bad feeling.</Text></Content>
    </Popover>
  </PopoverTrigger>
</Section>
