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
  TabNavigation,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex direction="column" gap="m">
    <Flex direction="column">
      <Breadcrumb color="dark">
        <Link>Projekt</Link>
        <Link>E-Mail-Adressen</Link>
        <Link>max@mustermann.de</Link>
      </Breadcrumb>
      <Heading color="dark" level={1}>
        max@mustermann.de
      </Heading>
    </Flex>

    <LayoutCard>
      <TabNavigation aria-label="E-Mail-Adresse">
        <Link href="#" aria-current="page">
          Allgemein
        </Link>
        <Link href="#">Weiterleitungen</Link>
        <Link href="#">Autoresponder</Link>
        <Link href="#">Backups</Link>
      </TabNavigation>

      <Section>
        <Header>
          <Heading>E-Mail-Adresse</Heading>
          <ModalTrigger>
            <Button>Bearbeiten</Button>
            <Modal offCanvas>
              <Heading>E-Mail-Adresse bearbeiten</Heading>
              <Content>
                <Text>…</Text>
              </Content>
            </Modal>
          </ModalTrigger>
        </Header>
        <ColumnLayout m={[1, 1]}>
          <LabeledValue>
            <Label>E-Mail-Adresse</Label>
            <Text>max@mustermann.de</Text>
          </LabeledValue>
          <LabeledValue>
            <Label>Angelegt am</Label>
            <Text>14. Februar 2026</Text>
          </LabeledValue>
        </ColumnLayout>
      </Section>

      <Section>
        <Heading>Speicherplatz</Heading>
        <Text>1,2 von 2 GB belegt</Text>
      </Section>
    </LayoutCard>
  </Flex>
);
