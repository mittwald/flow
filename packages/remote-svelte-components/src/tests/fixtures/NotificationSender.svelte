<script lang="ts">
  import Button from "../../auto-generated/Button.svelte";
  import Flex from "../../auto-generated/Flex.svelte";
  import Notification from "../../auto-generated/Notification.svelte";
  import Text from "../../auto-generated/Text.svelte";
  import { useNotificationController } from "../../components/notificationController.svelte.js";

  const { autoClose }: { autoClose: boolean } = $props();

  const notifications = useNotificationController();
  let lastId: number | undefined;
</script>

{#snippet transmission()}
  <Notification><Text>Rebel transmission</Text></Notification>
{/snippet}

<Flex columnGap="s">
  <Button
    onPress={() => (lastId = notifications.add(transmission, { autoClose }))}
    >Send</Button
  >
  <Button
    onPress={() => lastId !== undefined && notifications.remove(lastId)}
    >Dismiss</Button
  >
</Flex>
