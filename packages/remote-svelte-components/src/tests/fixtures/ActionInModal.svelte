<script lang="ts">
  import ActionGroup from "../../auto-generated/ActionGroup.svelte";
  import Button from "../../auto-generated/Button.svelte";
  import Content from "../../auto-generated/Content.svelte";
  import Heading from "../../auto-generated/Heading.svelte";
  import Text from "../../auto-generated/Text.svelte";
  import Action from "../../components/Action.svelte";
  import Modal from "../../overlays/Modal.svelte";
  import ModalTrigger from "../../overlays/OverlayTrigger.svelte";

  const { onAction }: { onAction?: () => unknown } = $props();
</script>

<ModalTrigger>
  <Button>Open</Button>
  <Modal>
    <Heading>Confirm</Heading>
    <Content><Text>Are you sure?</Text></Content>
    <ActionGroup>
      <Action closeModal={true} {onAction}><Button>Confirm</Button></Action>
    </ActionGroup>
  </Modal>
</ModalTrigger>
