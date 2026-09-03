import {
  ColumnLayout,
  Content,
  Flex,
  Header,
  HeaderNavigation,
  Heading,
  IconMittwald,
  Label,
  LabeledValue,
  LayoutCard,
  Link,
  Navigation,
  NavigationGroup,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Flex direction="column" gap="s">
  <Header>
    <HeaderNavigation aria-label="Hauptnavigation">
      <IconMittwald />
      <Link href="#" aria-current="page">
        Projekte
      </Link>
      <Link href="#">Domains</Link>
      <Link href="#">Abrechnung</Link>
    </HeaderNavigation>
  </Header>

  <ColumnLayout s={[null, 1]} m={[1, 2]} l={[1, 4]} gap="s">
    <LayoutCard>
      <Navigation aria-label="Projektnavigation">
        <NavigationGroup collapsable defaultExpanded>
          <Label>Projekt</Label>
          <Link href="#" aria-current="page">
            Übersicht
          </Link>
          <Link href="#">Apps</Link>
          <Link href="#">Container</Link>
        </NavigationGroup>
        <NavigationGroup collapsable>
          <Label>Daten</Label>
          <Link href="#">Datenbanken</Link>
          <Link href="#">Backups</Link>
        </NavigationGroup>
      </Navigation>
    </LayoutCard>

    <LayoutCard>
      <Section>
        <Heading>Übersicht</Heading>
        <Text>
          Das Projekt bündelt Apps, Datenbanken und Domains
          einer Website. Die Kennzahlen darunter beziehen
          sich auf den laufenden Abrechnungszeitraum.
        </Text>
        <ColumnLayout m={[1, 1]} l={[1, 1, 1]}>
          <LabeledValue>
            <Label>Apps</Label>
            <Content>3</Content>
          </LabeledValue>
          <LabeledValue>
            <Label>Speicherplatz</Label>
            <Content>12,4 von 25 GB</Content>
          </LabeledValue>
          <LabeledValue>
            <Label>Domains</Label>
            <Content>2</Content>
          </LabeledValue>
        </ColumnLayout>
      </Section>
    </LayoutCard>
  </ColumnLayout>
</Flex>;
