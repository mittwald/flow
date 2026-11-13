/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Alert,
  AlertBadge,
  AlertText,
  Badge,
  Button,
  Content,
  CounterBadge,
  Flex,
  Heading,
  IconNotification,
  Label,
  LoadingSpinner,
  Notification,
  NotificationProvider,
  ProgressBar,
  Section,
  Text,
  useNotificationController,
} from "@mittwald/flow-remote-vue-components";
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
import { defineComponent } from "vue";

const StatusPage = defineComponent({
  name: "StatusPage",
  setup() {
    const notifications = useNotificationController();
    let lastId: number | undefined;

    const send = () => {
      lastId = notifications.add(
        <Notification autoClose onClick={() => console.log("Clicked")}>
          <Text>Transmission received from Rebel command</Text>
        </Notification>,
      );
    };

    const dismissAll = () => {
      if (lastId === undefined) {
        return;
      }
      for (let i = 0; i <= lastId; i++) {
        notifications.remove(i);
      }
    };

    return () => (
      <ComponentGroupPage title="Status">
        <Section>
          <Heading level={3}>Alert</Heading>
          <Alert status="danger">
            <Heading>Mission failed</Heading>
            <Content>
              The assault on the Death Star could not be completed.
            </Content>
          </Alert>
        </Section>

        <Section>
          <Heading level={3}>AlertBadge</Heading>
          <AlertBadge status="warning">Shields low</AlertBadge>
        </Section>

        <Section>
          <Heading level={3}>AlertText</Heading>
          <AlertText status="success">Hyperdrive ready</AlertText>
        </Section>

        <Section>
          <Heading level={3}>Badge</Heading>
          <Badge color="success">Rebel Alliance</Badge>
        </Section>

        <Section>
          <Heading level={3}>CounterBadge</Heading>
          <Button variant="plain" color="secondary" aria-label="Transmissions">
            <IconNotification />
            <CounterBadge count={3} />
          </Button>
        </Section>

        <Section>
          <Heading level={3}>LoadingSpinner</Heading>
          <LoadingSpinner />
        </Section>

        <Section>
          <Heading level={3}>Notification</Heading>
          <Flex columnGap="s">
            <Button onPress={send}>Send transmission</Button>
            <Button onPress={dismissAll}>Dismiss all</Button>
          </Flex>
        </Section>

        <Section>
          <Heading level={3}>ProgressBar</Heading>
          <ProgressBar value={72} status="warning">
            <Label>Fuel</Label>
          </ProgressBar>
        </Section>
      </ComponentGroupPage>
    );
  },
});

/** The Vue counterpart of `/remote/components/status`. */
export const StatusDemo = defineComponent({
  name: "StatusDemo",
  // React's remote layout provides the notification controller; the Vue
  // `RemoteRoot` does not, so the page brings its own provider.
  setup: () => () => (
    <NotificationProvider>
      <StatusPage />
    </NotificationProvider>
  ),
});
