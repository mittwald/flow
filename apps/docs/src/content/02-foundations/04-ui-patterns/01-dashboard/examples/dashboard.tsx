import {
  Button,
  ColumnLayout,
  ContextMenu,
  ContextMenuTrigger,
  CopyButton,
  Header,
  Heading,
  IconContextMenu,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  MenuItem,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<ColumnLayout m={[1]} l={[1]}>
  <LayoutCard>
    <Section>
      <Header>
        <Heading>Projektübersicht</Heading>
        <ContextMenuTrigger>
          <Button color="secondary" variant="soft">
            <IconContextMenu />
          </Button>
          <ContextMenu>
            <MenuItem
              onAction={() => alert("not implemented")}
            >
              Domain umziehen
            </MenuItem>
            <MenuItem
              onAction={() => alert("not implemented")}
            >
              Domain entfernen
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <Button onPress={() => alert("not implemented")}>
          Tarif anpassen
        </Button>
      </Header>
      <ColumnLayout l={[1, 1, 1]} m={[1, 1]}>
        <LabeledValue>
          <Label>Projektname</Label>
          <Text>Mein Projekt</Text>
        </LabeledValue>
        <LabeledValue>
          <Label>Server</Label>
          <Link href="#">MeinServer-01</Link>
        </LabeledValue>
        <LabeledValue>
          <Label>Projektdomain</Label>
          <Link href="#" target="_blank">
            p-lis5uw.project.space
          </Link>
          <CopyButton text="p-lis5uw.project.space" />
        </LabeledValue>
        <LabeledValue>
          <Label>Erstelldatum</Label>
          <Text>06.12.2023 um 11:40 Uhr</Text>
        </LabeledValue>
        <LabeledValue>
          <Label>A-Record</Label>
          <Text>45.225.312.55</Text>
          <CopyButton text="45.225.312.55" />
        </LabeledValue>
        <LabeledValue>
          <Label>Shoert-ID</Label>
          <Text>p-lis5uw</Text>
          <CopyButton text="p-lis5uw" />
        </LabeledValue>
      </ColumnLayout>
    </Section>
  </LayoutCard>

  <ColumnLayout l={[1, 1]}>
    <LayoutCard>
      <Section>
        <Heading>Lerne mehr über Flow</Heading>
        <Text>
          Nutze unseren Styleguide, um mehr über das Design
          System Flow zu erfahren.
        </Text>
        <Link href="#">Zum Styleguide</Link>
      </Section>
    </LayoutCard>

    <LayoutCard>
      <Section>
        <Heading>Gib uns Feedback</Heading>
        <Text>
          Wir freuen uns auf deine Anmerkungen und Wünsche
          zu Flow.
        </Text>
        <Link href="https://github.com/mittwald/flow">
          Zum GitHub Repository
        </Link>
      </Section>
    </LayoutCard>
  </ColumnLayout>
</ColumnLayout>;
