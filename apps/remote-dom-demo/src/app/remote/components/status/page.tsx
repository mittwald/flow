"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
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
  ProgressBar,
  Section,
  Text,
  useNotificationController,
} from "@mittwald/flow-remote-react-components";
import { useRef } from "react";

export default function Page() {
  const notifications = useNotificationController();
  const lastId = useRef<number>(undefined);

  return (
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
        <Badge color="green">Rebel Alliance</Badge>
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
          <Button
            onPress={() => {
              lastId.current = notifications.add(
                <Notification autoClose onClick={() => console.log("Clicked")}>
                  <Text>Transmission received from Rebel command</Text>
                </Notification>,
              );
            }}
          >
            Send transmission
          </Button>
          <Button
            onPress={() => {
              if (lastId.current === undefined) {
                return;
              }
              for (let i = 0; i <= lastId.current; i++) {
                notifications.remove(i);
              }
            }}
          >
            Dismiss all
          </Button>
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
}
