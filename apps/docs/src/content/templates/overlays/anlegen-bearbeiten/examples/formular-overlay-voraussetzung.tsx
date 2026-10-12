import {
  Action,
  ActionGroup,
  Alert,
  Button,
  Content,
  Heading,
  Label,
  Modal,
  Option,
  Section,
  Select,
  Text,
  useModalController,
} from "@mittwald/flow-react-components";

export default () => {
  const controller = useModalController();

  return (
    <>
      <Button onPress={controller.open}>
        Extension installieren
      </Button>

      <Modal controller={controller} offCanvas>
        <Heading>Extension installieren</Heading>

        <Content>
          <Section>
            <Text>
              Wähle die Organisation, in der die Extension
              bereitgestellt werden soll.
            </Text>

            <Select isRequired defaultSelectedKey="1">
              <Label>Organisation</Label>
              <Option value="1">Meine Organisation</Option>
              <Option value="2">
                Noch eine Organisation
              </Option>
            </Select>

            <Alert status="warning">
              <Heading>
                Kein Vertragspartner hinterlegt
              </Heading>
              <Content>
                <Text>
                  Für diese Organisation ist noch kein
                  Vertragspartner hinterlegt. Lege einen an,
                  um mit der Installation fortzufahren.
                </Text>
                <Button>Vertragspartner anlegen</Button>
              </Content>
            </Alert>
          </Section>
        </Content>

        <ActionGroup>
          <Button isDisabled>Installieren</Button>
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
