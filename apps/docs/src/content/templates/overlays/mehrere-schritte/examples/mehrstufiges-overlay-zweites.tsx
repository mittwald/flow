import {
  Action,
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  FieldDescription,
  Header,
  Heading,
  InlineCode,
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
  const appController = useModalController();
  const subdomainController = useModalController();

  const [domains, setDomains] = useState([
    "mustermann.de",
    "muster-shop.de",
  ]);
  const [domain, setDomain] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState("");

  const addSubdomain = () => {
    const name = `${subdomain}.mustermann.de`;
    setDomains((all) => [...all, name]);
    setDomain(name);
    setSubdomain("");
    subdomainController.close();
  };

  return (
    <>
      <Button onPress={appController.open}>
        App anlegen
      </Button>

      <Modal controller={appController} offCanvas>
        <Heading>App anlegen</Heading>

        <Content>
          <Section>
            <ColumnLayout m={[2, 1]}>
              <TextField isRequired>
                <Label>Name</Label>
              </TextField>
              <Select
                isRequired
                defaultSelectedKey="6.7.14.1"
              >
                <Label>Version</Label>
                <Option value="6.7.14.1">6.7.14.1</Option>
                <Option value="6.7.13.0">6.7.13.0</Option>
                <Option value="6.6.10.7">6.6.10.7</Option>
              </Select>
            </ColumnLayout>

            <TextField isRequired>
              <Label>Installationsverzeichnis</Label>
              <FieldDescription>
                Deine App wird unter{" "}
                <InlineCode>
                  {"/html/<installationsverzeichnis>"}
                </InlineCode>{" "}
                installiert
              </FieldDescription>
            </TextField>
          </Section>

          <Section>
            <Header>
              <Heading>Hauptdomain zuweisen</Heading>
              {/*
               * Its own controller, not another step: the app overlay stays
               * open underneath and keeps what was already entered.
               */}
              <Button onPress={subdomainController.open}>
                Subdomain anlegen
              </Button>
            </Header>

            <Select
              isRequired
              placeholder="Domain wählen"
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

      <Modal controller={subdomainController}>
        <Heading>Subdomain anlegen</Heading>

        <Content>
          <Section>
            <Text>
              Eine Subdomain ist der Teil einer Domain, der
              vor dem eigentlichen Domainnamen steht und
              durch einen Punkt getrennt ist. Subdomains
              sind eine praktische Möglichkeit, verschiedene
              Bereiche einer Website voneinander zu trennen.
            </Text>

            <TextField
              isRequired
              value={subdomain}
              onChange={setSubdomain}
            >
              <Label>Subdomain</Label>
            </TextField>
          </Section>
        </Content>

        <ActionGroup>
          <Button
            color="success"
            isDisabled={subdomain.length === 0}
            onPress={addSubdomain}
          >
            Anlegen
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
