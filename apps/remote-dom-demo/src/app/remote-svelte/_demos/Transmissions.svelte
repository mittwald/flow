<script>
  import {
    Button,
    Flex,
    Notification,
    Text,
    useNotificationController,
  } from "@mittwald/flow-remote-svelte-components";

  const notifications = useNotificationController();
  let lastId;
</script>

<!--
  A snippet cannot be inspected, so `autoClose` is passed alongside it — where
  React and Vue read it off the element they were handed. Everything the
  notification renders itself, `onClick` included, stays in the snippet.
-->
{#snippet transmission()}
  <Notification onClick={() => console.log("Clicked")}
    ><Text>Transmission received from Rebel command</Text></Notification
  >
{/snippet}

<Flex columnGap="s">
  <Button
    onPress={() => {
      lastId = notifications.add(transmission, { autoClose: true });
    }}>Send transmission</Button
  >
  <Button
    onPress={() => {
      if (lastId === undefined) {
        return;
      }
      for (let id = 0; id <= lastId; id++) {
        notifications.remove(id);
      }
    }}>Dismiss all</Button
  >
</Flex>
