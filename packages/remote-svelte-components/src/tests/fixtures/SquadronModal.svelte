<script lang="ts">
  import ActionGroup from "../../auto-generated/ActionGroup.svelte";
  import Button from "../../auto-generated/Button.svelte";
  import Content from "../../auto-generated/Content.svelte";
  import Heading from "../../auto-generated/Heading.svelte";
  import Text from "../../auto-generated/Text.svelte";
  import Action from "../../components/Action.svelte";
  import Modal from "../../overlays/Modal.svelte";
  import ModalTrigger from "../../overlays/OverlayTrigger.svelte";

  const {
    onAction,
    offCanvas = false,
    size = "s",
  }: {
    onAction?: () => void;
    offCanvas?: boolean;
    size?: "s" | "m" | "l";
  } = $props();
</script>

<ModalTrigger>
  <Button>New squadron</Button>
  <Modal {offCanvas} {size}>
    <Heading>New squadron</Heading>
    <Content><Text>Rally your pilots.</Text></Content>
    <ActionGroup>
      <Action closeModal={true} {onAction}>
        <Button color="success">Create</Button>
      </Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>
