import {
  Action,
  ActionGroup,
  Alert,
  Button,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  Option,
  Section,
  Select,
  Text,
  TextField,
  useModalController,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const recordController = useModalController();
  const domainController = useModalController();

  const [domains, setDomains] = useState([
    "mustermann.de",
    "muster-shop.de",
  ]);
  const [domain, setDomain] = useState("mustermann.de");
  const [newDomain, setNewDomain] = useState("");

  const addDomain = () => {
    setDomains((all) => [...all, newDomain]);
    setDomain(newDomain);
    setNewDomain("");
    domainController.close();
  };

  return (
    <>
      <Button onPress={recordController.open}>
        DNS-Eintrag anlegen
      </Button>

      <Modal controller={recordController} offCanvas>
        <Heading>DNS-Eintrag anlegen</Heading>

        <Content>
          <Section>
            <Select
              isRequired
              selectedKey={domain}
              onChange={(key) => setDomain(String(key))}
            >
              <Label>Domain</Label>
              {domains.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>

            <Alert status="info">
              <Heading>Domain nicht dabei?</Heading>
              <Content>
                <Text>
                  Eine Domain, die noch nicht im Projekt
                  liegt, legst du hier an, ohne den Vorgang
                  zu verlassen.
                </Text>
                <Button
                  variant="soft"
                  color="secondary"
                  onPress={domainController.open}
                >
                  Domain hinzufügen
                </Button>
              </Content>
            </Alert>

            <TextField isRequired>
              <Label>Name</Label>
              <FieldDescription>z. B. www</FieldDescription>
            </TextField>
          </Section>
        </Content>

        <ActionGroup>
          <Action closeModal>
            <Button color="success">Anlegen</Button>
          </Action>
          <Action closeModal>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>

      {/*
       * Its own controller, not another step: the record overlay stays open
       * underneath and keeps what was already entered. The new domain is
       * selected when this one closes.
       */}
      <Modal controller={domainController}>
        <Heading>Domain hinzufügen</Heading>

        <Content>
          <Section>
            <TextField
              isRequired
              value={newDomain}
              onChange={setNewDomain}
            >
              <Label>Domain</Label>
              <FieldDescription>
                z. B. muster-blog.de
              </FieldDescription>
            </TextField>
          </Section>
        </Content>

        <ActionGroup>
          <Button
            isDisabled={newDomain.length === 0}
            onPress={addDomain}
          >
            Hinzufügen
          </Button>
          <Action closeModal>
            <Button variant="soft" color="secondary">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
};
