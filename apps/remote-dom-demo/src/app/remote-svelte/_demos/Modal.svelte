<script>
  import {
    Action,
    ActionGroup,
    Button,
    Content,
    Flex,
    Heading,
    Label,
    Modal,
    ModalTrigger,
    Section,
    Text,
    TextField,
    useOverlayController,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * Written against the same API as the React page — `ModalTrigger`, `Modal`,
   * `Action closeModal`, a controller — except that all four are this package's
   * Svelte rebuilds of Flow's React-only components, not remote elements.
   */
  const controller = useOverlayController();

  const explainer =
    "Think of a squadron as your crew. This is where you rally your pilots, " +
    "assign ships, and plan your next mission.";
</script>

{#snippet fields()}
  <Section>
    <Heading>What is a squadron?</Heading>
    <Text>{explainer}</Text>
    <TextField isRequired={true}><Label>Squadron name</Label></TextField>
  </Section>
{/snippet}

{#snippet modalContent(body)}
  <Heading>New squadron</Heading>
  <Content>{@render body()}</Content>
  <ActionGroup>
    <Action closeModal={true}>
      <Button color="success">Create squadron</Button>
    </Action>
    <Action closeModal={true}>
      <Button variant="soft" color="secondary">Cancel</Button>
    </Action>
  </ActionGroup>
{/snippet}

{#snippet twoFields()}
  {@render fields()}
  {@render fields()}
{/snippet}

<Section>
  <Flex columnGap="s">
    <ModalTrigger>
      <Button>New squadron</Button>
      <Modal>{@render modalContent(fields)}</Modal>
    </ModalTrigger>

    <ModalTrigger>
      <Button variant="outline">Offcanvas</Button>
      <Modal offCanvas={true} size="m">{@render modalContent(twoFields)}</Modal>
    </ModalTrigger>
  </Flex>

  <Label>With controller</Label>
  <Button onPress={controller.open}>New squadron</Button>
  <Modal {controller}>{@render modalContent(fields)}</Modal>
</Section>
