<script lang="ts">
  import NotificationProvider from "../../components/NotificationProvider.svelte";
  import NotificationSender from "./NotificationSender.svelte";

  const { autoClose = false }: { autoClose?: boolean } = $props();
</script>

<NotificationProvider><NotificationSender {autoClose} /></NotificationProvider>
