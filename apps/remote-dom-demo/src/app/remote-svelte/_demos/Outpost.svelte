<script>
  import {
    Button,
    Heading,
    Section,
    Text,
    TextField,
  } from "@mittwald/flow-remote-svelte-components";

  const { label, sleepMs } = $props();

  const contact = () =>
    new Promise((resolve) => setTimeout(() => resolve(sleepMs), sleepMs));

  let connection = $state(contact());
  let pings = $state(0);
  let isReconnecting = $state(false);

  const reconnect = async () => {
    isReconnecting = true;
    const next = contact();
    await next;
    connection = next;
    isReconnecting = false;
  };
</script>

{#await connection}
  <Heading>Contacting {label}…</Heading>
{:then value}
  <Section>
    <Heading>{label}</Heading>
    <Text>Reached in {value} ms</Text>
    <Button isPending={isReconnecting} onPress={() => void reconnect()}
      >Reconnect</Button
    >
    <Button color="secondary" variant="soft" onPress={() => pings++}>
      <Text>Pinged {pings}x</Text>
    </Button>
    <TextField aria-label="Outpost name" />
  </Section>
{/await}
