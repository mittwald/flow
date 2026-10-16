<script>
  import {
    Action,
    ActionGroup,
    Button,
    Content,
    ContextMenu,
    ContextMenuTrigger,
    Header,
    Heading,
    IconApp,
    MenuItem,
    Modal,
    ModalTrigger,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";
</script>

{#snippet stationActions()}
  <ContextMenuTrigger>
    <Button>Station actions</Button>
    <ContextMenu onAction={(item) => console.log(item)}>
      <MenuItem><IconApp /><Text>Fire superlaser</Text></MenuItem>
      <MenuItem>Rotate station</MenuItem>
      <MenuItem>Scan sector</MenuItem>
      <MenuItem>Self-destruct</MenuItem>
    </ContextMenu>
  </ContextMenuTrigger>
{/snippet}

<Section>
  <Header>
    <Heading>Death Star</Heading>
    <ModalTrigger>
      <Button>Battle station controls</Button>
      <Modal>
        <Heading>Battle station controls</Heading>
        <Content>Command the Death Star's systems.</Content>
        <ActionGroup>
          <Action closeModal={true}><Button>Close</Button></Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
    {@render stationActions()}
  </Header>
  <Content>{@render stationActions()}</Content>
</Section>
