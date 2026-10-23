"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  Action,
  ActionGroup,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  CopyButton,
  Heading,
  IconApp,
  MenuItem,
  Modal,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

export default function Page() {
  const [torpedoes, setTorpedoes] = useState(0);
  const [stationAction, setStationAction] = useState<string>();

  return (
    <ComponentGroupPage title="Actions">
      <Section>
        <Heading level={3}>Action</Heading>
        <Action onAction={() => console.log("Death Star destroyed")}>
          <Modal slot="actionConfirm">
            <Heading>Destroy the Death Star</Heading>
            <Content>
              Once the Death Star is destroyed, it cannot be rebuilt.
            </Content>
            <ActionGroup>
              <Button color="danger">Fire superlaser</Button>
              <Button color="secondary" variant="soft">
                Cancel
              </Button>
            </ActionGroup>
          </Modal>
          <Button color="danger">Destroy the Death Star</Button>
        </Action>
      </Section>

      <Section>
        <Heading level={3}>ActionGroup</Heading>
        <ActionGroup>
          <Button color="success">Create squadron</Button>
          <Button color="secondary" variant="soft">
            Cancel
          </Button>
        </ActionGroup>
      </Section>

      <Section>
        <Heading level={3}>Button</Heading>
        <Button onPress={() => setTorpedoes((count) => count + 1)}>
          Fire proton torpedo
        </Button>
        <Text>Torpedoes fired: {torpedoes}</Text>
      </Section>

      <Section>
        <Heading level={3}>ContextMenu</Heading>
        <ContextMenuTrigger>
          <Button>Station actions</Button>
          <ContextMenu onAction={(key) => setStationAction(String(key))}>
            <MenuItem id="fire">
              <IconApp />
              <Text>Fire superlaser</Text>
            </MenuItem>
            <MenuItem id="rotate">Rotate station</MenuItem>
            <MenuItem id="scan">Scan sector</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <Text>Last action: {stationAction ?? "–"}</Text>
      </Section>

      <Section>
        <Heading level={3}>CopyButton</Heading>
        <CopyButton text="ssh://rebelbase.org" />
      </Section>
    </ComponentGroupPage>
  );
}
