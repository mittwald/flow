import {
  Action,
  ActionGroup,
  Button,
  Content,
  CopyButton,
  Heading,
  InlineCode,
  Label,
  LabeledValue,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <ModalTrigger>
    <Button>Geheimnis anzeigen</Button>
    <Modal>
      <Heading>API-Token kopieren</Heading>
      <Content>
        <Section>
          <Text>
            Dein persönlicher Token wird dir{" "}
            <b>nur einmalig</b> angezeigt. Speichere ihn an
            einem sicheren Ort ab.
          </Text>
          <LabeledValue>
            <Label>API-Token</Label>
            <InlineCode>
              0664f2ab-9556-4a96-a95c-ea72800f379c
            </InlineCode>
            <CopyButton text="0664f2ab-9556-4a96-a95c-ea72800f379c" />
          </LabeledValue>
        </Section>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button variant="soft" color="secondary">
            Schließen
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  </ModalTrigger>
);
