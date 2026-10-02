<script>
  import {
    Action,
    ActionGroup,
    Button,
    ColumnLayout,
    Content,
    Flex,
    Heading,
    Image,
    Label,
    LightBox,
    LightBoxTrigger,
    Modal,
    ModalTrigger,
    Section,
    Text,
    TextField,
    useOverlayController,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * The same API as the React page — `ModalTrigger`, `Modal`,
   * `Action closeModal`, a controller — except that all four are this package's
   * Svelte rebuilds of Flow's React-only components, not remote elements.
   *
   * Two of the React page's variants have no counterpart here and are left out:
   * `confirmOnClose`, and the confirmation `Modal slot="actionConfirm"` an
   * `Action` opens. Both live in Flow's `ActionModel`, which this rebuild drops.
   */
  const controller = useOverlayController();

  const squadronExplainer =
    "Think of a squadron as your crew. This is where you rally your pilots, " +
    "assign ships, and plan your next mission.";
</script>

{#snippet squadronSection()}
  <Section>
    <Heading>What is a squadron?</Heading>
    <Text>{squadronExplainer}</Text>
    <TextField isRequired={true}><Label>Squadron name</Label></TextField>
  </Section>
{/snippet}

{#snippet actions()}
  <ActionGroup>
    <Action closeModal={true}>
      <Button color="success">Create squadron</Button>
      <Button variant="soft" color="secondary">Cancel</Button>
    </Action>
  </ActionGroup>
{/snippet}

<Section>
  <Flex columnGap="s">
    <ModalTrigger>
      <Button>New squadron</Button>
      <Modal>
        <Heading>New squadron</Heading>
        <Content>{@render squadronSection()}</Content>
        {@render actions()}
      </Modal>
    </ModalTrigger>

    <ModalTrigger>
      <Button>Offcanvas</Button>
      <Modal offCanvas={true}>
        <Heading>New squadron</Heading>
        <Content>{@render squadronSection()}{@render squadronSection()}</Content>
        {@render actions()}
      </Modal>
    </ModalTrigger>

    <ModalTrigger>
      <Button>With columns</Button>
      <Modal offCanvas={true} size="l">
        <Heading>New squadron</Heading>
        <ColumnLayout>
          {@render squadronSection()}{@render squadronSection()}
        </ColumnLayout>
        {@render actions()}
      </Modal>
    </ModalTrigger>

    <LightBoxTrigger>
      <Button>Lightbox</Button>
      <LightBox>
        <Image src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg" />
      </LightBox>
    </LightBoxTrigger>
  </Flex>

  <Label>With controller</Label>
  <Button onPress={controller.open}>New squadron</Button>
  <Modal {controller}>
    <Heading>New squadron</Heading>
    <Content>{@render squadronSection()}</Content>
    {@render actions()}
  </Modal>
</Section>
