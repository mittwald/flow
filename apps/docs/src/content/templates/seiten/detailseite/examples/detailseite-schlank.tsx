import {
  Breadcrumb,
  Button,
  ColumnLayout,
  Content,
  Flex,
  Header,
  Heading,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Flex direction="column">
      <Breadcrumb color="dark">
        <Link>Projekt</Link>
        <Link>E-Mails</Link>
        <Link>Weiterleitungen</Link>
        <Link>kontakt@mustermann.de</Link>
      </Breadcrumb>
      <Heading color="dark" level={1}>
        kontakt@mustermann.de
      </Heading>
    </Flex>

    <LayoutCard>
      <Section>
        <Header>
          <Heading>Weiterleitung</Heading>
          <ModalTrigger>
            <Button>Bearbeiten</Button>
            <Modal offCanvas>
              <Heading>Weiterleitung bearbeiten</Heading>
              <Content>
                <Text>…</Text>
              </Content>
            </Modal>
          </ModalTrigger>
        </Header>
        <ColumnLayout m={[1, 1]}>
          <LabeledValue>
            <Label>Adresse</Label>
            <Text>kontakt@mustermann.de</Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Zieladresse</Label>
            <Text>max@mustermann.de</Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>
    </LayoutCard>
  </Flex>
);
