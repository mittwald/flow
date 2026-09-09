import {
  BigNumber,
  ColumnLayout,
  DonutChart,
  Header,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <ColumnLayout m={[1, 1]}>
    <LayoutCard>
      <Section>
        <Header>
          <Heading>Zugestellte E-Mails</Heading>
          <Link href="#">Verlauf</Link>
        </Header>
        <BigNumber>
          <Text>1.284</Text>
          <Text>in den letzten 7 Tagen</Text>
        </BigNumber>
      </Section>
    </LayoutCard>

    <LayoutCard>
      <Section>
        <Header>
          <Heading>Speicherauslastung</Heading>
          <Link href="#">Details</Link>
        </Header>
        <DonutChart
          aria-label="Speicherauslastung"
          status="success"
          value={34}
        >
          <strong>34 %</strong>
        </DonutChart>
      </Section>
    </LayoutCard>
  </ColumnLayout>
);
